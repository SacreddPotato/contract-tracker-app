<?php

namespace App\Services\Employees;

use App\Services\Supabase\SupabaseClient;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class EmployeeNotificationService
{
    private const EMPLOYEE_SELECT_COLUMNS = 'id,owner_id,name,contract_end_date';

    private const NOTIFICATION_SELECT_COLUMNS = 'id,owner_id,employee_id,interval_days,contract_end_date,employee_name_snapshot,read_at,created_at,updated_at';

    /** @var array<int, int> */
    private const CONTRACT_INTERVALS = [90, 60, 30];

    public function __construct(private readonly SupabaseClient $client) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function syncDueContractNotifications(string $accessToken, string $ownerId = '0'): array
    {
        $today = CarbonImmutable::today();
        $maxContractEndDate = $today->addDays(max(self::CONTRACT_INTERVALS));
        $employees = $this->dueEmployees($accessToken, $today, $maxContractEndDate);
        $payload = [];

        foreach ($employees as $employee) {
            $contractEndDate = CarbonImmutable::parse((string) $employee['contract_end_date'])->startOfDay();
            $daysLeft = $today->diffInDays($contractEndDate, false);

            if ($daysLeft < 0) {
                continue;
            }

            foreach (self::CONTRACT_INTERVALS as $intervalDays) {
                if ($daysLeft > $intervalDays) {
                    continue;
                }

                $payload[] = [
                    'owner_id' => $ownerId,
                    'employee_id' => $employee['id'],
                    'interval_days' => $intervalDays,
                    'contract_end_date' => $employee['contract_end_date'],
                    'employee_name_snapshot' => $employee['name'],
                ];
            }
        }

        if ($payload === []) {
            return [];
        }

        $response = $this->request(fn () => $this->client->rest($accessToken)
            ->withHeader('Prefer', 'resolution=ignore-duplicates,return=representation')
            ->post('/employee_notifications?on_conflict=employee_id,interval_days,contract_end_date&select='.self::NOTIFICATION_SELECT_COLUMNS, $payload));

        return $this->collection($response->json());
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function list(string $accessToken): array
    {
        $response = $this->request(fn () => $this->client->rest($accessToken)->get('/employee_notifications', [
            'order' => 'created_at.desc',
            'select' => self::NOTIFICATION_SELECT_COLUMNS,
        ]));

        return $this->collection($response->json());
    }

    public function unreadCount(string $accessToken): int
    {
        $response = $this->request(fn () => $this->client->rest($accessToken)->get('/employee_notifications', [
            'read_at' => 'is.null',
            'select' => 'id',
        ]));

        return count($this->collection($response->json()));
    }

    /**
     * @return array<string, mixed>
     */
    public function markRead(string $accessToken, string $notificationId): array
    {
        $timestamp = CarbonImmutable::now()->toISOString();

        $response = $this->request(fn () => $this->client->rest($accessToken)
            ->withHeader('Prefer', 'return=representation')
            ->patch('/employee_notifications?id=eq.'.rawurlencode($notificationId).'&select='.self::NOTIFICATION_SELECT_COLUMNS, [
                'read_at' => $timestamp,
                'updated_at' => $timestamp,
            ]));

        return $this->firstRow($response->json());
    }

    public function markAllRead(string $accessToken): int
    {
        $timestamp = CarbonImmutable::now()->toISOString();

        $response = $this->request(fn () => $this->client->rest($accessToken)
            ->patch('/employee_notifications?read_at=is.null', [
                'read_at' => $timestamp,
                'updated_at' => $timestamp,
            ]));

        if (! $response->successful()) {
            throw new HttpException($response->status(), 'Unable to mark notifications read.');
        }

        return 0;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function dueEmployees(string $accessToken, CarbonImmutable $today, CarbonImmutable $maxContractEndDate): array
    {
        $query = http_build_query([
            'contract_end_date' => 'gte.'.$today->toDateString(),
            'select' => self::EMPLOYEE_SELECT_COLUMNS,
        ], '', '&', PHP_QUERY_RFC3986);
        $query .= '&contract_end_date='.rawurlencode('lte.'.$maxContractEndDate->toDateString());

        $response = $this->request(fn () => $this->client->rest($accessToken)->get('/employees?'.$query));

        return $this->collection($response->json());
    }

    /**
     * @param  callable(): Response  $callback
     */
    private function request(callable $callback): Response
    {
        try {
            $response = $callback();
        } catch (ConnectionException) {
            throw new ServiceUnavailableHttpException(null, 'Supabase data API is unavailable.');
        }

        if ($response->status() === 404) {
            throw new NotFoundHttpException('Notification not found.');
        }

        if (! $response->successful()) {
            throw new HttpException($response->status(), 'Supabase data API request failed.');
        }

        return $response;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function collection(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter($value, is_array(...)));
    }

    /**
     * @return array<string, mixed>
     */
    private function firstRow(mixed $value): array
    {
        $rows = $this->collection($value);

        if ($rows === []) {
            throw new NotFoundHttpException('Notification not found.');
        }

        return $rows[0];
    }
}
