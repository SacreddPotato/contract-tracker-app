import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    hasRequiredSupabaseConfig,
    resolveSupabaseConfig,
} from '../../resources/js/lib/supabase-config.ts';

test('runtime Supabase config overrides empty build-time values', () => {
    const config = resolveSupabaseConfig({
        runtimeConfig: {
            publishableKey: 'runtime-publishable-key',
            url: 'https://runtime.supabase.co',
        },
        viteConfig: {
            publishableKey: '',
            url: '',
        },
    });

    assert.deepEqual(config, {
        publishableKey: 'runtime-publishable-key',
        url: 'https://runtime.supabase.co',
    });
    assert.equal(hasRequiredSupabaseConfig(config), true);
});

test('empty runtime Supabase config does not override build-time values', () => {
    const config = resolveSupabaseConfig({
        runtimeConfig: {
            publishableKey: '',
            url: '',
        },
        viteConfig: {
            publishableKey: 'build-publishable-key',
            url: 'https://build.supabase.co',
        },
    });

    assert.deepEqual(config, {
        publishableKey: 'build-publishable-key',
        url: 'https://build.supabase.co',
    });
    assert.equal(hasRequiredSupabaseConfig(config), true);
});

test('missing required Supabase web config is detected', () => {
    const config = resolveSupabaseConfig({
        runtimeConfig: {
            url: 'https://runtime.supabase.co',
        },
    });

    assert.equal(hasRequiredSupabaseConfig(config), false);
});
