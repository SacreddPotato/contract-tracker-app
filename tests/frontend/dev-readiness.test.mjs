import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const script = readFileSync('scripts/check-dev-ready.mjs', 'utf8');

test('dev readiness check covers Neon database prerequisites', () => {
    assert.match(script, /APP_API_TOKEN/);
    assert.match(script, /DB_CONNECTION/);
    assert.match(script, /NEON_DEFAULT_DATABASE_BRANCH/);
    assert.match(script, /NEON_TESTING_DATABASE_URL/);
    assert.match(script, /NEON_PRODUCTION_DATABASE_URL/);
    assert.match(script, /APP_DATA_STORE !== 'neon'/);
    assert.match(script, /DB_CONNECTION !== 'pgsql'/);
    assert.match(script, /DB_URL/);
    assert.doesNotMatch(script, /Supabase CLI/);
    assert.doesNotMatch(script, /Docker/);
});
