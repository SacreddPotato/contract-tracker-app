import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';
import { test } from 'node:test';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const readme = readFileSync('README.md', 'utf8');

test('Supabase migration workflow is wired through npm scripts', () => {
    assert.equal(typeof packageJson.devDependencies?.supabase, 'string');
    assert.equal(packageJson.scripts['supabase:link'], 'node scripts/link-supabase-project.mjs');
    assert.equal(
        packageJson.scripts['supabase:migration:new'],
        'supabase migration new',
    );
    assert.equal(packageJson.scripts['supabase:migrate'], 'supabase migration up --linked');
    assert.equal(packageJson.scripts['supabase:schema:dump'], 'node scripts/dump-supabase-schema.mjs --linked');
});

test('Supabase project has local CLI configuration and schema dump helper', () => {
    assert.equal(existsSync('supabase/config.toml'), true);
    assert.equal(existsSync('scripts/link-supabase-project.mjs'), true);
    assert.equal(existsSync('scripts/dump-supabase-schema.mjs'), true);

    const config = readFileSync('supabase/config.toml', 'utf8');
    assert.match(config, /^project_id = "contract-tracker-app"/m);
    assert.match(config, /^\[api\]/m);
    assert.match(config, /^\[db\]/m);
    assert.match(config, /^enable_anonymous_sign_ins = true$/m);
    assert.match(config, /^enabled = false$/m);

    const helper = readFileSync('scripts/dump-supabase-schema.mjs', 'utf8');
    assert.match(helper, /supabase/);
    assert.match(helper, /db/);
    assert.match(helper, /dump/);
    assert.match(helper, /supabase\/schema\.sql/);
});

test('README documents migration-first schema changes', () => {
    assert.match(readme, /npm run supabase:link/);
    assert.match(readme, /npm run supabase:migration:new --/);
    assert.match(readme, /npm run supabase:migrate/);
    assert.match(readme, /npm run supabase:schema:dump/);
    assert.match(readme, /Do not edit `supabase\/schema\.sql` manually/);
    assert.doesNotMatch(readme, /Docker/);
});

test('schema dump helper exposes usage without requiring a database', () => {
    const result = spawnSync(
        process.execPath,
        ['scripts/dump-supabase-schema.mjs', '--help'],
        {
            encoding: 'utf8',
        },
    );

    assert.equal(result.status, 0);
    assert.match(result.stdout, /supabase:schema:dump/);
});

test('remote link helper exposes usage without requiring Supabase auth', () => {
    const result = spawnSync(
        process.execPath,
        ['scripts/link-supabase-project.mjs', '--help'],
        {
            encoding: 'utf8',
        },
    );

    assert.equal(result.status, 0);
    assert.match(result.stdout, /SUPABASE_URL/);
    assert.match(result.stdout, /SUPABASE_PROJECT_REF/);
    assert.match(result.stdout, /SUPABASE_ACCESS_TOKEN/);
    assert.match(result.stdout, /SUPABASE_DB_PASSWORD/);
    assert.match(result.stdout, /supabase link --project-ref/);
});
