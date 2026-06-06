<?php

namespace App\Services\Employees;

use App\Services\Supabase\SupabaseClient;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class EmployeeService
{
    private const SELECT_COLUMNS = 'id,owner_id,name,phone_number,nationality,email,contract_start_date,contract_end_date,iqama_start_date,iqama_end_date,created_at,updated_at';

    public function __construct(private readonly SupabaseClient $client) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function list(string $accessToken): array
    {
        $response = $this->request(fn () => $this->client->rest($accessToken)->get('/employees', [
            'order' => 'contract_end_date.asc',
            'select' => self::SELECT_COLUMNS,
        ]));

        return $this->collection($response->json());
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function create(string $accessToken, string $ownerId, array $data): array
    {
        $payload = [
            ...$data,
            'owner_id' => $ownerId,
        ];

        $response = $this->request(fn () => $this->client->rest($accessToken)
            ->withHeader('Prefer', 'return=representation')
            ->post('/employees?select='.self::SELECT_COLUMNS, $payload));

        return $this->firstRow($response->json());
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function update(string $accessToken, string $employeeId, array $data): array
    {
        $response = $this->request(fn () => $this->client->rest($accessToken)
            ->withHeader('Prefer', 'return=representation')
            ->patch('/employees?id=eq.'.rawurlencode($employeeId).'&select='.self::SELECT_COLUMNS, $data));

        return $this->firstRow($response->json());
    }

    public function delete(string $accessToken, string $employeeId): void
    {
        $response = $this->request(fn () => $this->client->rest($accessToken)
            ->delete('/employees?id=eq.'.rawurlencode($employeeId)));

        if (! $response->successful()) {
            throw new HttpException($response->status(), 'Unable to delete employee.');
        }
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
            throw new NotFoundHttpException('Employee not found.');
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
            throw new NotFoundHttpException('Employee not found.');
        }

        return $rows[0];
    }
}
