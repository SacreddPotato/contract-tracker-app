import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';

function javaMajorVersion(env = process.env) {
    try {
        const output = execFileSync('java', ['-version'], {
            encoding: 'utf8',
            env,
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        const match = output.match(/version "(?<version>\d+)(?:\.|\b)/);

        return match?.groups?.version ? Number(match.groups.version) : null;
    } catch (error) {
        const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
        const match = output.match(/version "(?<version>\d+)(?:\.|\b)/);

        return match?.groups?.version ? Number(match.groups.version) : null;
    }
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

function envWithJava21() {
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

const result = spawnSync(
    'firebase emulators:exec --only firestore "node --test tests/firestore/*.test.mjs"',
    {
        env: envWithJava21(),
        shell: true,
        stdio: 'inherit',
    },
);

process.exit(result.status ?? 1);
