<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\EmployeeNotification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployeeNotification>
 */
class EmployeeNotificationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contract_end_date' => fake()->dateTimeBetween('now', '+90 days')->format('Y-m-d'),
            'employee_id' => Employee::factory(),
            'employee_name_snapshot' => fake()->name(),
            'interval_days' => fake()->randomElement([90, 60, 30]),
            'owner_id' => '0',
            'read_at' => null,
        ];
    }
}
