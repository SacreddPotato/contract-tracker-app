import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    listNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    nextUnreadCountAfterMarkRead,
    syncContractNotifications,
    unreadNotificationCount,
} from '../../resources/js/services/notification-api.ts';

const notification = {
    contractEndDate: '2026-08-03',
    createdAt: '2026-06-04T10:30:00Z',
    employeeId: 'employee-1',
    employeeName: 'Ahmed Ali',
    id: 'notification-1',
    intervalDays: 60,
    readAt: null,
};

function jsonResponse(payload: unknown, status = 200): Response {
    return new Response(JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
        },
        status,
    });
}

test('notification API syncs and lists notifications with Supabase bearer token', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ data: [notification] });
    };

    assert.deepEqual(
        await syncContractNotifications({ accessToken: 'token-1', fetcher }),
        [notification],
    );
    assert.deepEqual(
        await listNotifications({ accessToken: 'token-1', fetcher }),
        [notification],
    );
    assert.equal(requests[0]?.input, '/api/notifications/sync');
    assert.equal(requests[0]?.init?.method, 'POST');
    assert.equal(requests[1]?.input, '/api/notifications');
    assert.deepEqual(requests[1]?.init?.headers, {
        Accept: 'application/json',
        Authorization: 'Bearer token-1',
    });
});

test('notification API reads unread count and marks notifications read', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        if (input === '/api/notifications/unread-count') {
            return jsonResponse({ unreadCount: 3 });
        }

        if (String(input).includes('/read-all')) {
            return jsonResponse({ unreadCount: 0 });
        }

        return jsonResponse({
            data: {
                ...notification,
                readAt: '2026-06-04T11:00:00Z',
            },
        });
    };

    assert.equal(
        await unreadNotificationCount({ accessToken: 'token-1', fetcher }),
        3,
    );
    assert.equal(
        (
            await markNotificationRead('notification-1', {
                accessToken: 'token-1',
                fetcher,
            })
        ).readAt,
        '2026-06-04T11:00:00Z',
    );
    assert.equal(
        await markAllNotificationsRead({ accessToken: 'token-1', fetcher }),
        0,
    );
    assert.equal(requests[1]?.input, '/api/notifications/notification-1/read');
    assert.equal(requests[1]?.init?.method, 'PATCH');
    assert.equal(requests[2]?.input, '/api/notifications/read-all');
    assert.equal(requests[2]?.init?.method, 'PATCH');
});

test('marking a read notification does not reduce unread counts in hook state', () => {
    const unreadCount = nextUnreadCountAfterMarkRead(
        [
            {
                ...notification,
                readAt: '2026-06-04T11:00:00Z',
            },
        ],
        {
            ...notification,
            readAt: '2026-06-04T11:00:00Z',
        },
        0,
    );

    assert.equal(unreadCount, 0);
});
