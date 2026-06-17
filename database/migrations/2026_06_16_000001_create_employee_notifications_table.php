<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_notifications', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('owner_id')->default('0')->index();
            $table->foreignUuid('employee_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('interval_days');
            $table->date('contract_end_date');
            $table->string('employee_name_snapshot');
            $table->timestamp('read_at')->nullable()->index();
            $table->timestamps();

            $table->unique(
                ['employee_id', 'interval_days', 'contract_end_date'],
                'employee_notifications_unique_contract_interval',
            );
            $table->index(['owner_id', 'read_at', 'created_at']);
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement(
                'alter table employee_notifications add constraint employee_notifications_interval_days_check check (interval_days in (90, 60, 30))',
            );
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_notifications');
    }
};
