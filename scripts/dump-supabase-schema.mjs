import { spawnSync } from 'node:child_process';
import { existsSync, renameSync, unlinkSync } from 'node:fs';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`Dump the Supabase public schema snapshot.

Usage:
  npm run supabase:schema:dump

The helper writes the dump to supabase/schema.sql using:
  supabase db dump --schema public --file supabase/schema.sql
`);
    process.exit(0);
}

const modes = new Set(['--local', '--linked']);
const mode = process.argv.find((argument) => modes.has(argument)) ?? '--linked';
const command = 'supabase';
const schemaPath = 'supabase/schema.sql';
const temporarySchemaPath = 'supabase/schema.sql.tmp';

if (existsSync(temporarySchemaPath)) {
    unlinkSync(temporarySchemaPath);
}

const args = [
    'db',
    'dump',
    mode,
    '--schema',
    'public',
    '--file',
    temporarySchemaPath,
];

const result = spawnSync(command, args, {
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: 'inherit',
});

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

if (result.status === 0) {
    renameSync(temporarySchemaPath, schemaPath);
}

process.exit(result.status ?? 1);
