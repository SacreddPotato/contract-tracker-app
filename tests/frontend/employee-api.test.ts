import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    createEmployee,
    deleteEmployee,
    listEmployees,
    updateEmployee,
} from '../../resources/js/services/employee-api.ts';

const employee = {
    contractEndDate: '2026-12-31',
    contractStartDate: '2026-01-01',
    createdAt: '2026-06-04T10:30:00Z',
    email: 'ahmed@example.com',
    id: 'employee-1',
    iqamaEndDate: null,
    iqamaStartDate: null,
    name: 'Ahmed Ali',
    nationality: 'Egyptian',
    ownerId: 'user-1',
    phoneNumber: '+20 100 000 0000',
    updatedAt: '2026-06-04T10:30:00Z',
};

function jsonResponse(payload: unknown, status = 200): Response {
    return new Response(JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
        },
        status,
    });
}

test('employee API lists employees with the app bearer token', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ data: [employee] });
    };

    assert.deepEqual(
        await listEmployees({ accessToken: 'token-1', fetcher }),
        [employee],
    );
    assert.equal(requests[0]?.input, '/api/employees');
    assert.deepEqual(requests[0]?.init?.headers, {
        Accept: 'application/json',
        Authorization: 'Bearer token-1',
    });
});

test('employee API can target the selected Neon database branch', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ data: [employee] });
    };

    await listEmployees({
        accessToken: 'token-1',
        databaseBranch: 'production',
        fetcher,
    });

    assert.deepEqual(requests[0]?.init?.headers, {
        Accept: 'application/json',
        Authorization: 'Bearer token-1',
        'X-App-Database-Branch': 'production',
    });
});

test('employee API creates and updates employees with JSON payloads', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return jsonResponse({ data: employee });
    };
    const values = {
        contractEndDate: '2026-12-31',
        contractStartDate: '2026-01-01',
        email: 'ahmed@example.com',
        iqamaEndDate: '',
        iqamaStartDate: '',
        name: 'Ahmed Ali',
        nationality: 'Egyptian',
        phoneNumber: '+20 100 000 0000',
    };

    assert.deepEqual(
        await createEmployee(values, { accessToken: 'token-1', fetcher }),
        employee,
    );
    assert.deepEqual(
        await updateEmployee('employee-1', values, {
            accessToken: 'token-1',
            fetcher,
        }),
        employee,
    );
    assert.equal(requests[0]?.input, '/api/employees');
    assert.equal(requests[0]?.init?.method, 'POST');
    assert.equal(requests[1]?.input, '/api/employees/employee-1');
    assert.equal(requests[1]?.init?.method, 'PATCH');
    assert.equal(requests[0]?.init?.body, JSON.stringify(values));
});

test('employee API deletes employees with the app bearer token', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> =
        [];
    const fetcher = async (
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> => {
        requests.push({ input, init });

        return new Response(null, { status: 204 });
    };

    await deleteEmployee('employee-1', { accessToken: 'token-1', fetcher });

    assert.equal(requests[0]?.input, '/api/employees/employee-1');
    assert.equal(requests[0]?.init?.method, 'DELETE');
});
