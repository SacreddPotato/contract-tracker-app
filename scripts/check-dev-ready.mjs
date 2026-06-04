import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';

const requiredEnvKeys = [
    'APP_KEY',
    'APP_DATA_STORE',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
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

function javaMajorVersion(env = process.env) {
    const output = commandOutput('java', ['-version'], { env });
    const match = output.match(/version "(?<version>\d+)(?:\.|\b)/);

    return match?.groups?.version ? Number(match.groups.version) : null;
}

function javaCandidates() {
    if (process.platform !== 'win32') {
        return [];
    }

    return [
        'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.6.7-hotspot',
        'C:\\Program Files\\Java\\jdk-24.0.2',
        'C:\\Program Files\\Java\\jdk-22',
        'C:\\Program Files\\Java\\latest',
    ];
}

function jdk21Env() {
    if (javaMajorVersion() >= 21) {
        return process.env;
    }

    const javaHome = javaCandidates().find((candidate) =>
        existsSync(join(candidate, 'bin', 'java.exe')),
    );

    if (!javaHome) {
        return process.env;
    }

    return {
        ...process.env,
        JAVA_HOME: javaHome,
        PATH: `${join(javaHome, 'bin')}${delimiter}${process.env.PATH ?? ''}`,
    };
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
        'Missing .env file. Copy .env.example to .env and fill in the Firebase web config.',
    );
} else {
    for (const key of requiredEnvKeys) {
        if (!env[key]) {
            failures.push(`Missing or empty ${key} in .env.`);
        }
    }

    if (env.APP_DATA_STORE !== 'firestore') {
        failures.push('APP_DATA_STORE must be firestore for this project.');
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

const effectiveJavaVersion = javaMajorVersion(jdk21Env());

if (!effectiveJavaVersion || effectiveJavaVersion < 21) {
    failures.push('Java 21+ is required for Firebase emulator tests.');
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

const firebaseProject = env?.VITE_FIREBASE_PROJECT_ID;

if (firebaseProject) {
    console.log(`Firebase project configured: ${firebaseProject}`);
}
