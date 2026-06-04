import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const requiredEnvKeys = [
    'APP_KEY',
    'APP_DATA_STORE',
    'SUPABASE_URL',
    'SUPABASE_PUBLISHABLE_KEY',
    'NATIVEPHP_APP_VERSION',
    'NATIVEPHP_APP_ID',
    'NATIVEPHP_UPDATER_ENABLED',
    'NATIVEPHP_UPDATER_PROVIDER',
];

function loadEnvFile() {
    if (!existsSync('.env')) {
        return null;
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

function commandOutput(command, args, options = {}) {
    const result = spawnSync(command, args, {
        encoding: 'utf8',
        ...options,
    });

    return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}

function phpHasZip() {
    const output = commandOutput('php', ['-m']);

    return output
        .split(/\r?\n/)
        .map((extension) => extension.trim().toLowerCase())
        .includes('zip');
}

const env = loadEnvFile();
const failures = [];
const warnings = [];

if (!env) {
    failures.push(
        'Missing .env file. Copy .env.example to .env and fill in the Supabase public config.',
    );
} else {
    for (const key of requiredEnvKeys) {
        if (!env[key]) {
            failures.push(`Missing or empty ${key} in .env.`);
        }
    }

    if (env.APP_DATA_STORE !== 'supabase') {
        failures.push('APP_DATA_STORE must be supabase for this project.');
    }
}

if (!existsSync('node_modules')) {
    failures.push('Missing node_modules. Run npm install.');
}

if (!existsSync('vendor')) {
    failures.push(
        'Missing vendor. Run composer install after enabling PHP ext-zip.',
    );
}

if (!phpHasZip()) {
    warnings.push(
        'PHP ext-zip is not enabled. App development can continue, but NativePHP desktop builds require it.',
    );
}

if (failures.length > 0) {
    console.error('Local dev readiness check failed:');

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    if (warnings.length > 0) {
        console.error('\nWarnings:');

        for (const warning of warnings) {
            console.error(`- ${warning}`);
        }
    }

    process.exit(1);
}

console.log('Local dev readiness check passed.');

if (warnings.length > 0) {
    console.log('\nWarnings:');

    for (const warning of warnings) {
        console.log(`- ${warning}`);
    }
}

const supabaseUrl = env?.SUPABASE_URL;

if (supabaseUrl) {
    console.log(`Supabase project configured: ${supabaseUrl}`);
}
