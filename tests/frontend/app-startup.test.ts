import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    getStartupPreference,
    setStartupPreference,
} from '../../resources/js/services/app-startup.ts';

function jsonResponse(payload: unknown, status = 200): Response {
    return new Response(JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
        },
        status,
    });
}

test('startup service reads the current startup preference', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ enabled: true, status: 'handled' });
    };

    assert.deepEqual(await getStartupPreference({ fetcher }), {
        enabled: true,
        status: 'handled',
    });
    assert.equal(requests[0]?.input, '/api/app/startup');
    assert.equal(requests[0]?.init?.method, undefined);
});

test('startup service updates the startup preference', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ enabled: false, status: 'handled' });
    };

    assert.deepEqual(await setStartupPreference(false, { fetcher }), {
        enabled: false,
        status: 'handled',
    });
    assert.equal(requests[0]?.input, '/api/app/startup');
    assert.equal(requests[0]?.init?.method, 'PUT');
    assert.equal(requests[0]?.init?.body, JSON.stringify({ enabled: false }));
});

test('startup service falls back to unavailable on invalid responses', async () => {
    const fetcher = async (): Promise<Response> => jsonResponse({}, 500);

    assert.deepEqual(await getStartupPreference({ fetcher }), {
        enabled: false,
        status: 'unavailable',
    });
});
