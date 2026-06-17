<?php

namespace App\Models;

use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    /** @use HasFactory<EmployeeFactory> */
    use HasFactory;

    use HasUuids;

    protected $fillable = [
        'contract_end_date',
        'contract_start_date',
        'email',
        'iqama_end_date',
        'iqama_start_date',
        'name',
        'nationality',
        'owner_id',
        'phone_number',
    ];

    protected function casts(): array
    {
        return [
            'contract_end_date' => 'date:Y-m-d',
            'contract_start_date' => 'date:Y-m-d',
            'iqama_end_date' => 'date:Y-m-d',
            'iqama_start_date' => 'date:Y-m-d',
        ];
    }

    /**
     * @return HasMany<EmployeeNotification, $this>
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(EmployeeNotification::class);
    }
}
