import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const employeeMigration = readFileSync(
    'database/migrations/2026_06_16_000000_create_employees_table.php',
    'utf8',
);
const notificationMigration = readFileSync(
    'database/migrations/2026_06_16_000001_create_employee_notifications_table.php',
    'utf8',
);

test('employee schema stores contract and iqama tracking fields', () => {
    assert.match(employeeMigration, /\$table->uuid\('id'\)->primary\(\)/);
    assert.match(employeeMigration, /\$table->string\('owner_id'\)->default\('0'\)/);
    assert.match(employeeMigration, /\$table->date\('contract_start_date'\)/);
    assert.match(employeeMigration, /\$table->date\('contract_end_date'\)->index\(\)/);
    assert.match(employeeMigration, /\$table->date\('iqama_start_date'\)->nullable\(\)/);
    assert.match(employeeMigration, /\$table->date\('iqama_end_date'\)->nullable\(\)/);
});

test('notification schema stores unique contract deadline alerts', () => {
    assert.match(notificationMigration, /\$table->foreignUuid\('employee_id'\)->constrained\(\)->cascadeOnDelete\(\)/);
    assert.match(notificationMigration, /\$table->unsignedSmallInteger\('interval_days'\)/);
    assert.match(notificationMigration, /employee_notifications_unique_contract_interval/);
    assert.match(notificationMigration, /employee_notifications_interval_days_check/);
});
