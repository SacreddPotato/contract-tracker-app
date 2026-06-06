import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`Link the Supabase CLI to the remote project configured in .env.

Usage:
  npm run supabase:link

The helper reads SUPABASE_PROJECT_REF or SUPABASE_URL, extracts the project ref, and runs:
  supabase link --project-ref <project-ref>

If your CLI asks for the database password, set SUPABASE_DB_PASSWORD in your
local ignored environment before running this helper.

You must already be authenticated with the Supabase CLI, or provide Supabase
CLI auth through SUPABASE_ACCESS_TOKEN in your local environment. Do not commit
Supabase access tokens, database passwords, or service-role keys.
`);
    process.exit(0);
}

const env = {
    ...process.env,
    ...loadEnvFile(),
};
const supabaseUrl = env.SUPABASE_URL;
const projectRef = env.SUPABASE_PROJECT_REF || projectRefFromUrl(supabaseUrl);

if (!projectRef) {
    console.error(
        'Missing SUPABASE_PROJECT_REF and unable to derive project ref from SUPABASE_URL.',
    );
    process.exit(1);
}

const args = ['link', '--project-ref', projectRef];

if (env.SUPABASE_DB_PASSWORD) {
    args.push('--password', env.SUPABASE_DB_PASSWORD);
}

const result = spawnSync('supabase', args, {
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: 'inherit',
});

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status ?? 1);

function loadEnvFile() {
    if (!existsSync('.env')) {
        return {};
    }

    return Object.fromEntries(
        readFileSync('.env', 'utf8')
            .split(/\r?\n/)
            .map((line) => line.match(/^([^#=]+)=(.*)$/))
            .filter(Boolean)
            .map((match) => [
                match[1].trim(),
                unquoteEnvValue(match[2].trim()),
            ]),
    );
}

function unquoteEnvValue(value) {
    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        return value.slice(1, -1);
    }

    return value;
}

function projectRefFromUrl(value) {
    try {
        const url = new URL(value);
        const [projectRef] = url.hostname.split('.');

        return projectRef && projectRef !== 'localhost' ? projectRef : null;
    } catch {
        return null;
    }
}
