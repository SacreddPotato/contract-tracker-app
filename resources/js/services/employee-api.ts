import type { Employee, EmployeeFormValues } from '@/services/employee-records';

type ApiCollectionResponse<T> = {
    data: T[];
};

type ApiResourceResponse<T> = {
    data: T;
};

type EmployeeApiOptions = {
    accessToken: string;
    fetcher?: typeof fetch;
};

export async function listEmployees({
    accessToken,
    fetcher = fetch,
}: EmployeeApiOptions): Promise<Employee[]> {
    const response = await fetcher('/api/employees', {
        headers: authorizedHeaders(accessToken),
    });

    if (!response.ok) {
        throw new Error('Unable to load employees.');
    }

    const payload = (await response.json()) as ApiCollectionResponse<Employee>;

    return payload.data;
}

export async function createEmployee(
    values: EmployeeFormValues,
    { accessToken, fetcher = fetch }: EmployeeApiOptions,
): Promise<Employee> {
    return employeeFromResponse(
        await fetcher('/api/employees', {
            body: JSON.stringify(values),
            headers: authorizedJsonHeaders(accessToken),
            method: 'POST',
        }),
    );
}

export async function updateEmployee(
    employeeId: string,
    values: EmployeeFormValues,
    { accessToken, fetcher = fetch }: EmployeeApiOptions,
): Promise<Employee> {
    return employeeFromResponse(
        await fetcher(`/api/employees/${encodeURIComponent(employeeId)}`, {
            body: JSON.stringify(values),
            headers: authorizedJsonHeaders(accessToken),
            method: 'PATCH',
        }),
    );
}

export async function deleteEmployee(
    employeeId: string,
    { accessToken, fetcher = fetch }: EmployeeApiOptions,
): Promise<void> {
    const response = await fetcher(
        `/api/employees/${encodeURIComponent(employeeId)}`,
        {
            headers: authorizedHeaders(accessToken),
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

function authorizedHeaders(accessToken: string): HeadersInit {
    return {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
    };
}

function authorizedJsonHeaders(accessToken: string): HeadersInit {
    return {
        ...authorizedHeaders(accessToken),
        'Content-Type': 'application/json',
    };
}
