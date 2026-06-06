<?php

namespace App\Http\Resources;

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
            'id' => $this->resource['id'],
            'employeeId' => $this->resource['employee_id'],
            'employeeName' => $this->resource['employee_name_snapshot'],
            'intervalDays' => $this->resource['interval_days'],
            'contractEndDate' => $this->resource['contract_end_date'],
            'readAt' => $this->resource['read_at'] ?? null,
            'createdAt' => $this->resource['created_at'],
        ];
    }
}
