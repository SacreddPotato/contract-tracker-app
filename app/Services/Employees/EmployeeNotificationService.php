<?php

namespace App\Services\Employees;

use App\Models\Employee;
use App\Models\EmployeeNotification;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EmployeeNotificationService
{
    /** @var array<int, int> */
    private const CONTRACT_INTERVALS = [90, 60, 30];

    /**
     * @return Collection<int, EmployeeNotification>
     */
    public function syncDueContractNotifications(string $ownerId = '0'): Collection
    {
        $today = CarbonImmutable::today();
        $maxContractEndDate = $today->addDays(max(self::CONTRACT_INTERVALS));
        $createdNotifications = collect();

        Employee::query()
            ->where('owner_id', $ownerId)
            ->whereBetween('contract_end_date', [
                $today->toDateString(),
                $maxContractEndDate->toDateString(),
            ])
            ->orderByDesc('contract_end_date')
            ->get()
            ->each(function (Employee $employee) use ($createdNotifications, $today, $ownerId): void {
                $contractEndDate = CarbonImmutable::parse((string) $employee->contract_end_date)->startOfDay();
                $daysLeft = $today->diffInDays($contractEndDate, false);

                foreach (self::CONTRACT_INTERVALS as $intervalDays) {
                    if ($daysLeft > $intervalDays) {
                        continue;
                    }

                    $notification = EmployeeNotification::query()->firstOrCreate(
                        [
                            'contract_end_date' => $employee->contract_end_date,
                            'employee_id' => $employee->id,
                            'interval_days' => $intervalDays,
                        ],
                        [
                            'employee_name_snapshot' => $employee->name,
                            'owner_id' => $ownerId,
                        ],
                    );

                    if ($notification->wasRecentlyCreated) {
                        $createdNotifications->push($notification->refresh());
                    }
                }
            });

        return $createdNotifications;
    }

    /**
     * @return Collection<int, EmployeeNotification>
     */
    public function list(): Collection
    {
        return EmployeeNotification::query()
            ->where('owner_id', '0')
            ->orderByDesc('created_at')
            ->get();
    }

    public function unreadCount(): int
    {
        return EmployeeNotification::query()
            ->where('owner_id', '0')
            ->whereNull('read_at')
            ->count();
    }

    public function markRead(string $notificationId): EmployeeNotification
    {
        $notification = $this->findSharedNotification($notificationId);
        $notification->forceFill([
            'read_at' => CarbonImmutable::now(),
        ])->save();

        return $notification->refresh();
    }

    public function markAllRead(): int
    {
        EmployeeNotification::query()
            ->where('owner_id', '0')
            ->whereNull('read_at')
            ->update([
                'read_at' => CarbonImmutable::now(),
                'updated_at' => CarbonImmutable::now(),
            ]);

        return 0;
    }

    private function findSharedNotification(string $notificationId): EmployeeNotification
    {
        $notification = EmployeeNotification::query()
            ->where('owner_id', '0')
            ->whereKey($notificationId)
            ->first();

        if (! $notification) {
            throw new NotFoundHttpException('Notification not found.');
        }

        return $notification;
    }
}
