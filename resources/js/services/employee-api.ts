import type { Employee, EmployeeFormValues } from '@/services/employee-records';

type ApiCollectionResponse<T> = {
    data: T[];
};

type ApiResourceResponse<T> = {
    data: T;
};

type EmployeeApiOptions = {
    accessToken: string;
    databaseBranch?: 'testing' | 'production' | null;
    fetcher?: typeof fetch;
};

export async function listEmployees({
    accessToken,
    databaseBranch = null,
    fetcher = fetch,
}: EmployeeApiOptions): Promise<Employee[]> {
    const response = await fetcher('/api/employees', {
        headers: authorizedHeaders(accessToken, databaseBranch),
    });

    if (!response.ok) {
        throw new Error('Unable to load employees.');
    }

    const payload = (await response.json()) as ApiCollectionResponse<Employee>;

    return payload.data;
}

export async function createEmployee(
    values: EmployeeFormValues,
    { accessToken, databaseBranch = null, fetcher = fetch }: EmployeeApiOptions,
): Promise<Employee> {
    return employeeFromResponse(
        await fetcher('/api/employees', {
            body: JSON.stringify(values),
            headers: authorizedJsonHeaders(accessToken, databaseBranch),
            method: 'POST',
        }),
    );
}

export async function updateEmployee(
    employeeId: string,
    values: EmployeeFormValues,
    { accessToken, databaseBranch = null, fetcher = fetch }: EmployeeApiOptions,
): Promise<Employee> {
    return employeeFromResponse(
        await fetcher(`/api/employees/${encodeURIComponent(employeeId)}`, {
            body: JSON.stringify(values),
            headers: authorizedJsonHeaders(accessToken, databaseBranch),
            method: 'PATCH',
        }),
    );
}

export async function deleteEmployee(
    employeeId: string,
    { accessToken, databaseBranch = null, fetcher = fetch }: EmployeeApiOptions,
): Promise<void> {
    const response = await fetcher(
        `/api/employees/${encodeURIComponent(employeeId)}`,
        {
            headers: authorizedHeaders(accessToken, databaseBranch),
            method: 'DELETE',
        },
    );

    if (!response.ok) {
        throw new Error('Unable to delete employee.');
    }
}

async function employeeFromResponse(response: Response): Promise<Employee> {
    if (!response.ok) {
        throw new Error('Unable to save employee.');
    }

    const payload = (await response.json()) as ApiResourceResponse<Employee>;

    return payload.data;
}

function authorizedHeaders(
    accessToken: string,
    databaseBranch: EmployeeApiOptions['databaseBranch'] = null,
): HeadersInit {
    return withoutNullHeaders({
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-App-Database-Branch': databaseBranch,
    });
}

function authorizedJsonHeaders(
    accessToken: string,
    databaseBranch: EmployeeApiOptions['databaseBranch'] = null,
): HeadersInit {
    return {
        ...authorizedHeaders(accessToken, databaseBranch),
        'Content-Type': 'application/json',
    };
}

function withoutNullHeaders(
    headers: Record<string, string | null>,
): HeadersInit {
    return Object.fromEntries(
        Object.entries(headers).filter(([, value]) => value !== null),
    ) as Record<string, string>;
}
