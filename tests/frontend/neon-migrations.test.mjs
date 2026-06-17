import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

test('Neon migration workflow is owned by Laravel migrations', () => {
    assert.equal(packageJson.scripts['neon:migrate'], 'php artisan migrate');
    assert.equal(
        existsSync(
            'database/migrations/2026_06_16_000000_create_employees_table.php',
        ),
        true,
    );
    assert.equal(
        existsSync(
            'database/migrations/2026_06_16_000001_create_employee_notifications_table.php',
        ),
        true,
    );
});

test('employee product tables are defined in Laravel migrations', () => {
    const employeeMigration = readFileSync(
        'database/migrations/2026_06_16_000000_create_employees_table.php',
        'utf8',
    );
    const notificationMigration = readFileSync(
        'database/migrations/2026_06_16_000001_create_employee_notifications_table.php',
        'utf8',
    );

    assert.match(employeeMigration, /Schema::create\('employees'/);
    assert.match(employeeMigration, /owner_id/);
    assert.match(employeeMigration, /contract_end_date/);
    assert.match(employeeMigration, /iqama_end_date/);
    assert.match(
        notificationMigration,
        /Schema::create\('employee_notifications'/,
    );
    assert.match(
        notificationMigration,
        /employee_notifications_unique_contract_interval/,
    );
});

test('Windows release builds a NativePHP PHP binary with PostgreSQL support', () => {
    const workflow = readFileSync(
        '.github/workflows/release-windows.yml',
        'utf8',
    );

    assert.match(workflow, /Build NativePHP PostgreSQL PHP binary/);
    assert.match(workflow, /pdo_pgsql/);
    assert.match(workflow, /pgsql/);
    assert.match(workflow, /NATIVEPHP_PHP_BINARY_PATH/);
    assert.match(workflow, /Built NativePHP PHP binary is missing pdo_pgsql/);
});
