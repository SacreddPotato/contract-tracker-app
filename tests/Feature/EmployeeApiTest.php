<?php

namespace Tests\Feature;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('app.api_token', 'local-app-token');
    }

    public function test_employee_index_requires_the_local_app_token(): void
    {
        $this->getJson('/api/employees')
            ->assertUnauthorized();
    }

    public function test_employee_index_lists_shared_rows_from_the_database(): void
    {
        Employee::factory()->create([
            'contract_end_date' => '2026-12-31',
            'name' => 'Later Employee',
        ]);
        Employee::factory()->create([
            'contract_end_date' => '2026-06-30',
            'name' => 'Earlier Employee',
            'phone_number' => '+20 100 000 0000',
            'nationality' => 'Egyptian',
            'email' => 'ahmed@example.com',
        ]);

        $this->withToken('local-app-token')
            ->getJson('/api/employees')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Earlier Employee')
            ->assertJsonPath('data.0.ownerId', '0')
            ->assertJsonPath('data.0.contractEndDate', '2026-06-30')
            ->assertJsonPath('data.0.phoneNumber', '+20 100 000 0000')
            ->assertJsonPath('data.0.nationality', 'Egyptian')
            ->assertJsonPath('data.0.email', 'ahmed@example.com')
            ->assertJsonPath('data.1.name', 'Later Employee');
    }

    public function test_employee_store_validates_and_creates_a_shared_database_row(): void
    {
        $payload = [
            'contractEndDate' => '2026-12-31',
            'contractStartDate' => '2026-01-01',
            'email' => 'ahmed@example.com',
            'iqamaEndDate' => null,
            'iqamaStartDate' => null,
            'name' => 'Ahmed Ali',
            'nationality' => 'Egyptian',
            'phoneNumber' => '+20 100 000 0000',
        ];

        $this->withToken('local-app-token')
            ->postJson('/api/employees', $payload)
            ->assertCreated()
            ->assertJsonPath('data.name', 'Ahmed Ali')
            ->assertJsonPath('data.ownerId', '0');

        $this->assertDatabaseHas('employees', [
            'email' => 'ahmed@example.com',
            'name' => 'Ahmed Ali',
            'owner_id' => '0',
            'phone_number' => '+20 100 000 0000',
        ]);
    }

    public function test_employee_store_rejects_invalid_payloads_before_database_writes(): void
    {
        $this->withToken('local-app-token')
            ->postJson('/api/employees', [
                'contractEndDate' => '',
                'contractStartDate' => 'not-a-date',
                'name' => '',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'contractEndDate',
                'contractStartDate',
                'name',
            ]);

        $this->assertDatabaseCount('employees', 0);
    }

    public function test_employee_store_rejects_invalid_optional_email_before_database_writes(): void
    {
        $this->withToken('local-app-token')
            ->postJson('/api/employees', [
                'contractEndDate' => '2026-12-31',
                'contractStartDate' => '2026-01-01',
                'email' => 'not-an-email',
                'name' => 'Ahmed Ali',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'email',
            ]);

        $this->assertDatabaseCount('employees', 0);
    }

    public function test_employee_update_and_delete_use_database_rows(): void
    {
        $employee = Employee::factory()->create([
            'name' => 'Ahmed Ali',
        ]);

        $payload = [
            'contractEndDate' => '2026-12-31',
            'contractStartDate' => '2026-01-01',
            'email' => '',
            'iqamaEndDate' => null,
            'iqamaStartDate' => null,
            'name' => 'Updated Name',
            'nationality' => 'Egyptian',
            'phoneNumber' => '',
        ];

        $this->withToken('local-app-token')
            ->patchJson("/api/employees/{$employee->id}", $payload)
            ->assertOk()
            ->assertJsonPath('data.name', 'Updated Name')
            ->assertJsonPath('data.phoneNumber', null)
            ->assertJsonPath('data.email', null);

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'email' => null,
            'name' => 'Updated Name',
            'phone_number' => null,
        ]);

        $this->withToken('local-app-token')
            ->deleteJson("/api/employees/{$employee->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('employees', [
            'id' => $employee->id,
        ]);
    }
}
