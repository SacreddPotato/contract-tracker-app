import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const script = readFileSync('scripts/check-dev-ready.mjs', 'utf8');

test('dev readiness check covers Supabase migration prerequisites', () => {
    assert.match(script, /supabase\/config\.toml/);
    assert.match(script, /supabase\/migrations/);
    assert.match(script, /Supabase CLI/);
    assert.match(script, /supabase\/\.temp\/project-ref/);
    assert.doesNotMatch(script, /Docker/);
});
