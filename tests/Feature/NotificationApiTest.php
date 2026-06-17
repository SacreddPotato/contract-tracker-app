<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\EmployeeNotification;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('app.api_token', 'local-app-token');
        CarbonImmutable::setTestNow(CarbonImmutable::create(2026, 6, 4));
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_notification_index_requires_the_local_app_token(): void
    {
        $this->getJson('/api/notifications')
            ->assertUnauthorized();
    }

    public function test_notification_sync_creates_due_contract_notifications_once(): void
    {
        Employee::factory()->create([
            'contract_end_date' => '2026-09-02',
            'name' => 'Ahmed Ali',
        ]);
        Employee::factory()->create([
            'contract_end_date' => '2026-08-03',
            'name' => 'Farah',
        ]);
        Employee::factory()->create([
            'contract_end_date' => '2026-07-04',
            'name' => 'Mona',
        ]);
        Employee::factory()->create([
            'contract_end_date' => '2026-10-01',
            'name' => 'Future',
        ]);

        $this->withToken('local-app-token')
            ->postJson('/api/notifications/sync')
            ->assertOk()
            ->assertJsonCount(6, 'data')
            ->assertJsonPath('data.0.employeeName', 'Ahmed Ali')
            ->assertJsonPath('data.0.intervalDays', 90)
            ->assertJsonPath('data.1.intervalDays', 90)
            ->assertJsonPath('data.2.intervalDays', 60)
            ->assertJsonPath('data.5.intervalDays', 30);

        $this->assertDatabaseCount('employee_notifications', 6);

        $this->withToken('local-app-token')
            ->postJson('/api/notifications/sync')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        $this->assertDatabaseCount('employee_notifications', 6);
    }

    public function test_notification_list_count_and_read_actions_use_database_rows(): void
    {
        $employee = Employee::factory()->create([
            'contract_end_date' => '2026-08-03',
            'name' => 'Ahmed Ali',
        ]);
        $notification = EmployeeNotification::factory()->for($employee)->create([
            'contract_end_date' => '2026-08-03',
            'employee_name_snapshot' => 'Ahmed Ali',
            'interval_days' => 60,
            'read_at' => null,
        ]);
        EmployeeNotification::factory()->for($employee)->create([
            'contract_end_date' => '2026-08-03',
            'interval_days' => 30,
            'read_at' => null,
        ]);

        $this->withToken('local-app-token')
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonPath('data.0.employeeName', 'Ahmed Ali')
            ->assertJsonPath('data.0.readAt', null);

        $this->withToken('local-app-token')
            ->getJson('/api/notifications/unread-count')
            ->assertOk()
            ->assertJsonPath('unreadCount', 2);

        $this->withToken('local-app-token')
            ->patchJson("/api/notifications/{$notification->id}/read")
            ->assertOk()
            ->assertJsonPath('data.readAt', '2026-06-04T00:00:00.000000Z');

        $this->withToken('local-app-token')
            ->patchJson('/api/notifications/read-all')
            ->assertOk()
            ->assertJsonPath('unreadCount', 0);

        $this->assertDatabaseMissing('employee_notifications', [
            'read_at' => null,
        ]);
    }
}
