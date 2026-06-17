<?php

namespace App\Http\Resources;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeNotificationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->value('id'),
            'employeeId' => $this->value('employee_id'),
            'employeeName' => $this->value('employee_name_snapshot'),
            'intervalDays' => $this->value('interval_days'),
            'contractEndDate' => $this->dateValue('contract_end_date'),
            'readAt' => $this->timestampValue('read_at'),
            'createdAt' => $this->timestampValue('created_at'),
        ];
    }

    private function value(string $key): mixed
    {
        if ($this->resource instanceof Model) {
            return $this->resource->getAttribute($key);
        }

        return $this->resource[$key] ?? null;
    }

    private function dateValue(string $key): ?string
    {
        $value = $this->value($key);

        if ($value instanceof CarbonInterface) {
            return $value->toDateString();
        }

        return is_string($value) && $value !== '' ? $value : null;
    }

    private function timestampValue(string $key): ?string
    {
        $value = $this->value($key);

        if ($value instanceof CarbonInterface) {
            return $value->toJSON();
        }

        return is_string($value) && $value !== '' ? $value : null;
    }
}
