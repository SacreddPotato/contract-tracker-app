<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $contractStartDate = fake()->dateTimeBetween('-1 year', 'now');
        $contractEndDate = fake()->dateTimeBetween('now', '+1 year');

        return [
            'contract_end_date' => $contractEndDate->format('Y-m-d'),
            'contract_start_date' => $contractStartDate->format('Y-m-d'),
            'email' => fake()->optional()->safeEmail(),
            'iqama_end_date' => fake()->optional()->dateTimeBetween('now', '+1 year')?->format('Y-m-d'),
            'iqama_start_date' => fake()->optional()->dateTimeBetween('-1 year', 'now')?->format('Y-m-d'),
            'name' => fake()->name(),
            'nationality' => fake()->optional()->country(),
            'owner_id' => '0',
            'phone_number' => fake()->optional()->phoneNumber(),
        ];
    }
}
