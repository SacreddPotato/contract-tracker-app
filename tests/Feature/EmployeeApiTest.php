<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set('supabase.url', 'https://project.supabase.co');
        config()->set('supabase.publishable_key', 'publishable-key');
    }

    public function test_employee_index_requires_a_supabase_bearer_token(): void
    {
        $this->getJson('/api/employees')
            ->assertUnauthorized();
    }

    public function test_employee_index_verifies_the_user_and_lists_rows_through_supabase(): void
    {
        Http::fake([
            'https://project.supabase.co/auth/v1/user' => Http::response([
                'id' => '11111111-1111-1111-1111-111111111111',
            ]),
            'https://project.supabase.co/rest/v1/employees*' => Http::response([
                $this->employeeRow(),
            ]),
        ]);

        $this->withToken('user-token')
            ->getJson('/api/employees')
            ->assertOk()
            ->assertJsonPath('data.0.id', 'employee-1')
            ->assertJsonPath('data.0.ownerId', '11111111-1111-1111-1111-111111111111')
            ->assertJsonPath('data.0.contractEndDate', '2026-12-31');

        Http::assertSent(fn ($request) => $request->url() === 'https://project.supabase.co/rest/v1/employees?order=contract_end_date.asc&select=id%2Cowner_id%2Cname%2Ccontract_start_date%2Ccontract_end_date%2Ciqama_start_date%2Ciqama_end_date%2Ccreated_at%2Cupdated_at'
            && $request->hasHeader('Authorization', 'Bearer user-token')
            && $request->hasHeader('apikey', 'publishable-key'));
    }

    public function test_employee_store_validates_and_creates_a_row_owned_by_the_supabase_user(): void
    {
        Http::fake([
            'https://project.supabase.co/auth/v1/user' => Http::response([
                'id' => '11111111-1111-1111-1111-111111111111',
            ]),
            'https://project.supabase.co/rest/v1/employees*' => Http::response([
                $this->employeeRow(),
            ], 201),
        ]);

        $payload = [
            'contractEndDate' => '2026-12-31',
            'contractStartDate' => '2026-01-01',
            'iqamaEndDate' => null,
            'iqamaStartDate' => null,
            'name' => 'Ahmed Ali',
        ];

        $this->withToken('user-token')
            ->postJson('/api/employees', $payload)
            ->assertOk()
            ->assertJsonPath('data.name', 'Ahmed Ali');

        Http::assertSent(fn ($request) => $request->method() === 'POST'
            && $request->url() === 'https://project.supabase.co/rest/v1/employees?select=id,owner_id,name,contract_start_date,contract_end_date,iqama_start_date,iqama_end_date,created_at,updated_at'
            && $request['owner_id'] === '11111111-1111-1111-1111-111111111111'
            && $request['name'] === 'Ahmed Ali');
    }

    public function test_employee_store_rejects_invalid_payloads_before_supabase_writes(): void
    {
        Http::fake();

        $this->withToken('user-token')
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

        Http::assertNothingSent();
    }

    public function test_employee_update_and_delete_are_forwarded_with_the_user_token(): void
    {
        Http::fake([
            'https://project.supabase.co/auth/v1/user' => Http::response([
                'id' => '11111111-1111-1111-1111-111111111111',
            ]),
            'https://project.supabase.co/rest/v1/employees*' => Http::sequence()
                ->push([$this->employeeRow(name: 'Updated Name')])
                ->push([], 204),
        ]);

        $payload = [
            'contractEndDate' => '2026-12-31',
            'contractStartDate' => '2026-01-01',
            'iqamaEndDate' => null,
            'iqamaStartDate' => null,
            'name' => 'Updated Name',
        ];

        $this->withToken('user-token')
            ->patchJson('/api/employees/employee-1', $payload)
            ->assertOk()
            ->assertJsonPath('data.name', 'Updated Name');

        $this->withToken('user-token')
            ->deleteJson('/api/employees/employee-1')
            ->assertNoContent();

        Http::assertSent(fn ($request) => $request->method() === 'PATCH'
            && str_contains($request->url(), '/employees?id=eq.employee-1')
            && $request['name'] === 'Updated Name');
        Http::assertSent(fn ($request) => $request->method() === 'DELETE'
            && str_contains($request->url(), '/employees?id=eq.employee-1'));
    }

    /**
     * @return array<string, mixed>
     */
    private function employeeRow(string $name = 'Ahmed Ali'): array
    {
        return [
            'contract_end_date' => '2026-12-31',
            'contract_start_date' => '2026-01-01',
            'created_at' => '2026-06-04T10:30:00Z',
            'id' => 'employee-1',
            'iqama_end_date' => null,
            'iqama_start_date' => null,
            'name' => $name,
            'owner_id' => '11111111-1111-1111-1111-111111111111',
            'updated_at' => '2026-06-04T10:30:00Z',
        ];
    }
}
