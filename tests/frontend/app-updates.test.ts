import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    checkForAppUpdates,
    createStartupUpdateChecker,
    installDownloadedAppUpdate,
} from '../../resources/js/services/app-updates.ts';

function jsonResponse(payload: unknown): Response {
    return new Response(JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 200,
    });
}

test('startup update checker calls the backend once per app launch', async () => {
    let calls = 0;
    const checkOnStartup = createStartupUpdateChecker(async () => {
        calls += 1;

        return { status: 'checking' };
    });

    assert.deepEqual(await checkOnStartup(), { status: 'checking' });
    assert.equal(await checkOnStartup(), null);
    assert.equal(calls, 1);
});

test('manual update checks can be triggered repeatedly', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ status: 'checking' });
    };

    assert.deepEqual(await checkForAppUpdates({ fetcher }), {
        status: 'checking',
    });
    assert.deepEqual(await checkForAppUpdates({ fetcher }), {
        status: 'checking',
    });

    assert.equal(requests.length, 2);
    assert.equal(requests[0]?.input, '/api/app/updates/check');
    assert.equal(requests[0]?.init?.method, 'POST');
});

test('app update installer posts to the backend install action', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ status: 'installing' });
    };

    assert.deepEqual(await installDownloadedAppUpdate({ fetcher }), {
        status: 'installing',
    });

    assert.equal(requests[0]?.input, '/api/app/updates/install');
    assert.equal(requests[0]?.init?.method, 'POST');
});

test('app update service accepts downloaded and error states from the backend', async () => {
    const fetcher = async (): Promise<Response> =>
        jsonResponse({ status: 'downloaded' });

    assert.deepEqual(await checkForAppUpdates({ fetcher }), {
        status: 'downloaded',
    });
});
