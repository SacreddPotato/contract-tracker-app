import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const schema = readFileSync('supabase/schema.sql', 'utf8');

test('Supabase schema enables RLS and owner policies for employees', () => {
    assert.match(schema, /alter table public\.employees enable row level security/i);
    assert.match(schema, /owner_id = '0'/i);
    assert.match(schema, /phone_number text null/i);
    assert.match(schema, /nationality text null/i);
    assert.match(schema, /email text null/i);
    assert.match(schema, /for select/i);
    assert.match(schema, /for insert/i);
    assert.match(schema, /for update/i);
    assert.match(schema, /for delete/i);
    assert.match(schema, /prevent_employee_owner_change/i);
    assert.match(schema, /owner_id is distinct from old\.owner_id/i);
});

test('Supabase schema stores contract deadline notifications', () => {
    assert.match(schema, /create table public\.employee_notifications/i);
    assert.match(schema, /employee_id uuid not null/i);
    assert.match(schema, /references public\.employees\(id\) on delete cascade/i);
    assert.match(schema, /interval_days integer not null/i);
    assert.match(schema, /check \(interval_days in \(90, 60, 30\)\)/i);
    assert.match(schema, /contract_end_date date not null/i);
    assert.match(schema, /employee_name_snapshot text not null/i);
    assert.match(schema, /read_at timestamp with time zone null/i);
    assert.match(schema, /unique \(employee_id, interval_days, contract_end_date\)/i);
    assert.match(schema, /alter table public\.employee_notifications enable row level security/i);
    assert.match(schema, /employee_notifications_shared_select/i);
    assert.match(schema, /employee_notifications_owner_id_idx/i);
    assert.match(schema, /prevent_employee_notification_owner_change/i);
});
