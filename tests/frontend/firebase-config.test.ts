import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    hasRequiredFirebaseConfig,
    resolveFirebaseConfig,
} from '../../resources/js/lib/firebase-config.ts';

test('runtime Firebase config overrides empty build-time values', () => {
    const config = resolveFirebaseConfig({
        runtimeConfig: {
            apiKey: 'runtime-api-key',
            appId: 'runtime-app-id',
            authDomain: 'runtime.firebaseapp.com',
            messagingSenderId: '123456789',
            projectId: 'runtime-project',
            storageBucket: 'runtime.appspot.com',
        },
        viteConfig: {
            apiKey: '',
            appId: '',
            authDomain: '',
            projectId: '',
        },
    });

    assert.deepEqual(config, {
        apiKey: 'runtime-api-key',
        appId: 'runtime-app-id',
        authDomain: 'runtime.firebaseapp.com',
        messagingSenderId: '123456789',
        projectId: 'runtime-project',
        storageBucket: 'runtime.appspot.com',
    });
    assert.equal(hasRequiredFirebaseConfig(config), true);
});

test('empty runtime Firebase config does not override build-time values', () => {
    const config = resolveFirebaseConfig({
        runtimeConfig: {
            apiKey: '',
            appId: '',
            authDomain: '',
            messagingSenderId: '',
            projectId: '',
            storageBucket: '',
        },
        viteConfig: {
            apiKey: 'build-api-key',
            appId: 'build-app-id',
            authDomain: 'build.firebaseapp.com',
            messagingSenderId: '987654321',
            projectId: 'build-project',
            storageBucket: 'build.appspot.com',
        },
    });

    assert.deepEqual(config, {
        apiKey: 'build-api-key',
        appId: 'build-app-id',
        authDomain: 'build.firebaseapp.com',
        messagingSenderId: '987654321',
        projectId: 'build-project',
        storageBucket: 'build.appspot.com',
    });
    assert.equal(hasRequiredFirebaseConfig(config), true);
});

test('missing required Firebase web config is detected', () => {
    const config = resolveFirebaseConfig({
        runtimeConfig: {
            apiKey: 'runtime-api-key',
            authDomain: 'runtime.firebaseapp.com',
        },
    });

    assert.equal(hasRequiredFirebaseConfig(config), false);
});
