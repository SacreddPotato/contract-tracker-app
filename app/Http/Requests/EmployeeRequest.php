<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'contractStartDate' => $this->emptyStringToNull($this->input('contractStartDate')),
            'contractEndDate' => $this->emptyStringToNull($this->input('contractEndDate')),
            'phoneNumber' => $this->emptyStringToNull($this->input('phoneNumber')),
            'nationality' => $this->emptyStringToNull($this->input('nationality')),
            'email' => $this->emptyStringToNull($this->input('email')),
            'iqamaStartDate' => $this->emptyStringToNull($this->input('iqamaStartDate')),
            'iqamaEndDate' => $this->emptyStringToNull($this->input('iqamaEndDate')),
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contractStartDate' => ['required', 'date_format:Y-m-d'],
            'contractEndDate' => ['required', 'date_format:Y-m-d'],
            'phoneNumber' => ['nullable', 'string', 'max:255'],
            'nationality' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email:rfc', 'max:255'],
            'iqamaStartDate' => ['nullable', 'date_format:Y-m-d'],
            'iqamaEndDate' => ['nullable', 'date_format:Y-m-d'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function normalizedEmployeeData(): array
    {
        return [
            'name' => $this->input('name'),
            'phone_number' => $this->input('phoneNumber'),
            'nationality' => $this->input('nationality'),
            'email' => $this->input('email'),
            'contract_start_date' => $this->input('contractStartDate'),
            'contract_end_date' => $this->input('contractEndDate'),
            'iqama_start_date' => $this->input('iqamaStartDate'),
            'iqama_end_date' => $this->input('iqamaEndDate'),
        ];
    }

    private function emptyStringToNull(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }
}
