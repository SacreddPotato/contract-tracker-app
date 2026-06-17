<?php

namespace App\Services\Employees;

use App\Models\Employee;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EmployeeService
{
    /**
     * @return Collection<int, Employee>
     */
    public function list(): Collection
    {
        return Employee::query()
            ->where('owner_id', '0')
            ->orderBy('contract_end_date')
            ->get();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(string $ownerId, array $data): Employee
    {
        return Employee::query()->create([
            ...$data,
            'owner_id' => $ownerId,
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(string $employeeId, array $data): Employee
    {
        $employee = $this->findSharedEmployee($employeeId);
        $employee->fill($data);
        $employee->save();

        return $employee->refresh();
    }

    public function delete(string $employeeId): void
    {
        $this->findSharedEmployee($employeeId)->delete();
    }

    private function findSharedEmployee(string $employeeId): Employee
    {
        $employee = Employee::query()
            ->where('owner_id', '0')
            ->whereKey($employeeId)
            ->first();

        if (! $employee) {
            throw new NotFoundHttpException('Employee not found.');
        }

        return $employee;
    }
}
