import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    hasRequiredAppApiConfig,
    resolveAppApiConfig,
} from '../../resources/js/lib/app-api-config.ts';

test('runtime app API token overrides empty build-time values', () => {
    const config = resolveAppApiConfig({
        runtimeConfig: {
            databaseBranch: 'testing',
            databaseBranchHeader: 'X-App-Database-Branch',
            databaseBranchToggleEnabled: true,
            token: 'runtime-token',
        },
        viteConfig: {
            token: '',
        },
    });

    assert.deepEqual(config, {
        databaseBranch: 'testing',
        databaseBranchHeader: 'X-App-Database-Branch',
        databaseBranchToggleEnabled: true,
        token: 'runtime-token',
    });
    assert.equal(hasRequiredAppApiConfig(config), true);
});

test('empty runtime app API token does not override build-time values', () => {
    const config = resolveAppApiConfig({
        runtimeConfig: {
            token: ' ',
        },
        viteConfig: {
            token: 'build-token',
        },
    });

    assert.deepEqual(config, {
        token: 'build-token',
    });
    assert.equal(hasRequiredAppApiConfig(config), true);
});

test('missing app API token is detected', () => {
    const config = resolveAppApiConfig({
        runtimeConfig: {
            token: '',
        },
        viteConfig: {
            token: '',
        },
    });

    assert.equal(hasRequiredAppApiConfig(config), false);
});
