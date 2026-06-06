<?php

namespace Tests\Feature;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set('supabase.url', 'https://project.supabase.co');
        config()->set('supabase.publishable_key', 'publishable-key');

        CarbonImmutable::setTestNow(CarbonImmutable::create(2026, 6, 4));
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_notification_index_requires_a_supabase_bearer_token(): void
    {
        $this->getJson('/api/notifications')
            ->assertUnauthorized();
    }

    public function test_notification_sync_creates_due_contract_notifications_once(): void
    {
        Http::fake([
            'https://project.supabase.co/auth/v1/user' => Http::response([
                'id' => '11111111-1111-1111-1111-111111111111',
            ]),
            'https://project.supabase.co/rest/v1/employees*' => Http::response([
                $this->employeeRow(contractEndDate: '2026-09-02'),
                $this->employeeRow(id: 'employee-2', name: 'Farah', contractEndDate: '2026-08-03'),
                $this->employeeRow(id: 'employee-3', name: 'Mona', contractEndDate: '2026-07-04'),
                $this->employeeRow(id: 'employee-4', name: 'Future', contractEndDate: '2026-10-01'),
            ]),
            'https://project.supabase.co/rest/v1/employee_notifications*' => Http::response([
                $this->notificationRow(intervalDays: 90, contractEndDate: '2026-09-02'),
                $this->notificationRow(id: 'notification-2', employeeId: 'employee-2', employeeName: 'Farah', intervalDays: 90, contractEndDate: '2026-08-03'),
                $this->notificationRow(id: 'notification-3', employeeId: 'employee-2', employeeName: 'Farah', intervalDays: 60, contractEndDate: '2026-08-03'),
                $this->notificationRow(id: 'notification-4', employeeId: 'employee-3', employeeName: 'Mona', intervalDays: 90, contractEndDate: '2026-07-04'),
                $this->notificationRow(id: 'notification-5', employeeId: 'employee-3', employeeName: 'Mona', intervalDays: 60, contractEndDate: '2026-07-04'),
                $this->notificationRow(id: 'notification-6', employeeId: 'employee-3', employeeName: 'Mona', intervalDays: 30, contractEndDate: '2026-07-04'),
            ], 201),
        ]);

        $this->withToken('user-token')
            ->postJson('/api/notifications/sync')
            ->assertOk()
            ->assertJsonCount(6, 'data')
            ->assertJsonPath('data.0.employeeId', 'employee-1')
            ->assertJsonPath('data.0.intervalDays', 90)
            ->assertJsonPath('data.1.intervalDays', 90)
            ->assertJsonPath('data.2.intervalDays', 60)
            ->assertJsonPath('data.5.intervalDays', 30);

        Http::assertSent(fn ($request) => $request->method() === 'GET'
            && str_contains($request->url(), '/employees')
            && str_contains($request->url(), 'contract_end_date=lte.2026-09-02')
            && str_contains($request->url(), 'contract_end_date=gte.2026-06-04'));
        Http::assertSent(fn ($request) => $request->method() === 'POST'
            && str_contains($request->url(), '/employee_notifications?on_conflict=employee_id,interval_days,contract_end_date')
            && $request[0]['owner_id'] === '0'
            && $request[0]['employee_id'] === 'employee-1'
            && $request[0]['interval_days'] === 90
            && $request[5]['interval_days'] === 30);
    }

    public function test_notification_list_count_and_read_actions_use_supabase_rows(): void
    {
        Http::fake([
            'https://project.supabase.co/auth/v1/user' => Http::response([
                'id' => '11111111-1111-1111-1111-111111111111',
            ]),
            'https://project.supabase.co/rest/v1/employee_notifications*' => Http::sequence()
                ->push([$this->notificationRow()])
                ->push([$this->notificationRow(), $this->notificationRow(id: 'notification-2')])
                ->push([$this->notificationRow(readAt: '2026-06-04T11:00:00Z')])
                ->push([], 204),
        ]);

        $this->withToken('user-token')
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonPath('data.0.employeeName', 'Ahmed Ali')
            ->assertJsonPath('data.0.readAt', null);

        $this->withToken('user-token')
            ->getJson('/api/notifications/unread-count')
            ->assertOk()
            ->assertJsonPath('unreadCount', 2);

        $this->withToken('user-token')
            ->patchJson('/api/notifications/notification-1/read')
            ->assertOk()
            ->assertJsonPath('data.readAt', '2026-06-04T11:00:00Z');

        $this->withToken('user-token')
            ->patchJson('/api/notifications/read-all')
            ->assertOk()
            ->assertJsonPath('unreadCount', 0);

        Http::assertSent(fn ($request) => $request->method() === 'GET'
            && str_contains($request->url(), '/employee_notifications?')
            && str_contains($request->url(), 'order=created_at.desc')
            && str_contains($request->url(), 'select=id%2Cowner_id%2Cemployee_id%2Cinterval_days%2Ccontract_end_date%2Cemployee_name_snapshot%2Cread_at%2Ccreated_at%2Cupdated_at'));
        Http::assertSent(fn ($request) => $request->method() === 'GET'
            && $request->url() === 'https://project.supabase.co/rest/v1/employee_notifications?read_at=is.null&select=id');
        Http::assertSent(fn ($request) => $request->method() === 'PATCH'
            && str_contains($request->url(), '/employee_notifications?id=eq.notification-1')
            && $request['read_at'] !== null);
        Http::assertSent(fn ($request) => $request->method() === 'PATCH'
            && str_contains($request->url(), '/employee_notifications?read_at=is.null')
            && $request['read_at'] !== null);
    }

    /**
     * @return array<string, mixed>
     */
    private function employeeRow(string $id = 'employee-1', string $name = 'Ahmed Ali', string $contractEndDate = '2026-09-02'): array
    {
        return [
            'contract_end_date' => $contractEndDate,
            'id' => $id,
            'name' => $name,
            'owner_id' => '0',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function notificationRow(
        string $id = 'notification-1',
        string $employeeId = 'employee-1',
        string $employeeName = 'Ahmed Ali',
        int $intervalDays = 90,
        string $contractEndDate = '2026-09-02',
        ?string $readAt = null,
    ): array {
        return [
            'contract_end_date' => $contractEndDate,
            'created_at' => '2026-06-04T10:30:00Z',
            'employee_id' => $employeeId,
            'employee_name_snapshot' => $employeeName,
            'id' => $id,
            'interval_days' => $intervalDays,
            'owner_id' => '0',
            'read_at' => $readAt,
            'updated_at' => '2026-06-04T10:30:00Z',
        ];
    }
}
