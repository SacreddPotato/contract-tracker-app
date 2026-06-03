<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SecuritySettingsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'can_manage_two_factor' => $this->resource['can_manage_two_factor'],
            'can_manage_passkeys' => $this->resource['can_manage_passkeys'],
            'passkeys' => $this->resource['passkeys'],
            'password_rules' => $this->resource['password_rules'],
            'two_factor_enabled' => $this->when(
                array_key_exists('two_factor_enabled', $this->resource),
                $this->resource['two_factor_enabled'] ?? false,
            ),
            'requires_confirmation' => $this->when(
                array_key_exists('requires_confirmation', $this->resource),
                $this->resource['requires_confirmation'] ?? false,
            ),
        ];
    }
}
