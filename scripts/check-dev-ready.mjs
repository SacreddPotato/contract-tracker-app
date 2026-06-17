import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const requiredEnvKeys = [
    'APP_KEY',
    'APP_DATA_STORE',
    'APP_API_TOKEN',
    'DB_CONNECTION',
    'NEON_DEFAULT_DATABASE_BRANCH',
    'NEON_TESTING_DATABASE_URL',
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
        'Missing .env file. Copy .env.example to .env and fill in the Neon database config.',
    );
} else {
    for (const key of requiredEnvKeys) {
        if (!env[key]) {
            failures.push(`Missing or empty ${key} in .env.`);
        }
    }

    if (env.APP_DATA_STORE !== 'neon') {
        failures.push('APP_DATA_STORE must be neon for this project.');
    }

    if (env.DB_CONNECTION !== 'pgsql') {
        failures.push('DB_CONNECTION must be pgsql for Neon-backed product data.');
    }

    if (!env.DB_URL && (!env.DB_HOST || !env.DB_DATABASE || !env.DB_USERNAME || !env.DB_PASSWORD)) {
        failures.push('Set DB_URL or DB_HOST, DB_DATABASE, DB_USERNAME, and DB_PASSWORD for Neon.');
    }

    if (env.NEON_DEFAULT_DATABASE_BRANCH !== 'testing') {
        failures.push('NEON_DEFAULT_DATABASE_BRANCH must be testing for local development.');
    }

    if (!env.NEON_PRODUCTION_DATABASE_URL) {
        warnings.push('NEON_PRODUCTION_DATABASE_URL is missing. The dev database toggle cannot switch to production.');
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

const neonTarget = env?.DB_URL || env?.DB_HOST;

if (neonTarget) {
    console.log(`Neon database configured: ${neonTarget}`);
}
