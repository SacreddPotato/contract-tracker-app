<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource['id'],
            'ownerId' => $this->resource['owner_id'],
            'name' => $this->resource['name'],
            'contractStartDate' => $this->resource['contract_start_date'],
            'contractEndDate' => $this->resource['contract_end_date'],
            'iqamaStartDate' => $this->resource['iqama_start_date'] ?? null,
            'iqamaEndDate' => $this->resource['iqama_end_date'] ?? null,
            'createdAt' => $this->resource['created_at'],
            'updatedAt' => $this->resource['updated_at'],
        ];
    }
}
