<?php

namespace App\Models;

use Database\Factories\EmployeeNotificationFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeNotification extends Model
{
    /** @use HasFactory<EmployeeNotificationFactory> */
    use HasFactory;

    use HasUuids;

    protected $fillable = [
        'contract_end_date',
        'employee_id',
        'employee_name_snapshot',
        'interval_days',
        'owner_id',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'contract_end_date' => 'date:Y-m-d',
            'interval_days' => 'integer',
            'read_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
