import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const schema = readFileSync('supabase/schema.sql', 'utf8');

test('Supabase schema enables RLS and owner policies for employees', () => {
    assert.match(schema, /alter table public\.employees enable row level security/i);
    assert.match(schema, /owner_id = '0'/i);
    assert.match(schema, /for select/i);
    assert.match(schema, /for insert/i);
    assert.match(schema, /for update/i);
    assert.match(schema, /for delete/i);
    assert.match(schema, /prevent_employee_owner_change/i);
    assert.match(schema, /owner_id is distinct from old\.owner_id/i);
});
