import assert from 'node:assert/strict';
import { test } from 'node:test';

import { controlAppWindow } from '../../resources/js/services/app-window.ts';

function jsonResponse(payload: unknown): Response {
    return new Response(JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 200,
    });
}

test('window control service posts the requested native window action', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ status: 'handled' });
    };

    assert.deepEqual(await controlAppWindow('minimize', { fetcher }), {
        status: 'handled',
    });
    assert.deepEqual(await controlAppWindow('maximize', { fetcher }), {
        status: 'handled',
    });
    assert.deepEqual(await controlAppWindow('restore', { fetcher }), {
        status: 'handled',
    });
    assert.deepEqual(await controlAppWindow('close', { fetcher }), {
        status: 'handled',
    });

    assert.deepEqual(
        requests.map((request) => [request.input, request.init?.method]),
        [
            ['/api/app/window/minimize', 'POST'],
            ['/api/app/window/maximize', 'POST'],
            ['/api/app/window/restore', 'POST'],
            ['/api/app/window/close', 'POST'],
        ],
    );
});
