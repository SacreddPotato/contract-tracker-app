<?php

namespace App\Http\Resources;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
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
            'id' => $this->value('id'),
            'ownerId' => $this->value('owner_id'),
            'name' => $this->value('name'),
            'phoneNumber' => $this->value('phone_number'),
            'nationality' => $this->value('nationality'),
            'email' => $this->value('email'),
            'contractStartDate' => $this->dateValue('contract_start_date'),
            'contractEndDate' => $this->dateValue('contract_end_date'),
            'iqamaStartDate' => $this->dateValue('iqama_start_date'),
            'iqamaEndDate' => $this->dateValue('iqama_end_date'),
            'createdAt' => $this->timestampValue('created_at'),
            'updatedAt' => $this->timestampValue('updated_at'),
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
