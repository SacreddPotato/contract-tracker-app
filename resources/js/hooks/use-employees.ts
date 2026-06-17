import { useCallback, useEffect, useState } from 'react';

import {
    createEmployee,
    deleteEmployee,
    listEmployees,
    updateEmployee,
} from '@/services/employee-api';
import type { Employee, EmployeeFormValues } from '@/services/employee-records';

type EmployeeSubscriptionState = {
    databaseBranch: 'testing' | 'production' | null;
    employees: Employee[];
    error: Error | null;
    subscriptionKey: number;
    accessToken: string | null;
};

type EmployeesState = {
    addEmployee: (values: EmployeeFormValues) => Promise<void>;
    deleteEmployee: (employeeId: string) => Promise<void>;
    employees: Employee[];
    error: Error | null;
    isLoading: boolean;
    retry: () => void;
    updateEmployee: (
        employeeId: string,
        values: EmployeeFormValues,
    ) => Promise<void>;
};

export function useEmployees(
    accessToken: string | null,
    databaseBranch: 'testing' | 'production' | null = null,
): EmployeesState {
    const [state, setState] = useState<EmployeeSubscriptionState>({
        accessToken: null,
        databaseBranch: null,
        employees: [],
        error: null,
        subscriptionKey: 0,
    });
    const [subscriptionKey, setSubscriptionKey] = useState(0);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        let cancelled = false;

        void listEmployees({ accessToken, databaseBranch })
            .then((nextEmployees) => {
                if (cancelled) {
                    return;
                }

                setState({
                    accessToken,
                    databaseBranch,
                    employees: nextEmployees,
                    error: null,
                    subscriptionKey,
                });
            })
            .catch((nextError: unknown) => {
                if (cancelled) {
                    return;
                }

                setState({
                    accessToken,
                    databaseBranch,
                    employees: [],
                    error:
                        nextError instanceof Error
                            ? nextError
                            : new Error('Unable to load employees.'),
                    subscriptionKey,
                });
            });

        return () => {
            cancelled = true;
        };
    }, [accessToken, databaseBranch, subscriptionKey]);

    const addEmployee = useCallback(
        async (values: EmployeeFormValues) => {
            if (!accessToken) {
                throw new Error('Employee storage is unavailable.');
            }

            const employee = await createEmployee(values, {
                accessToken,
                databaseBranch,
            });

            setState((current) => ({
                ...current,
                employees: [...current.employees, employee].sort(
                    sortByContractEndDate,
                ),
            }));
        },
        [accessToken, databaseBranch],
    );

    const saveEmployeeUpdate = useCallback(
        async (employeeId: string, values: EmployeeFormValues) => {
            if (!accessToken) {
                throw new Error('Employee storage is unavailable.');
            }

            const employee = await updateEmployee(employeeId, values, {
                accessToken,
                databaseBranch,
            });

            setState((current) => ({
                ...current,
                employees: current.employees
                    .map((currentEmployee) =>
                        currentEmployee.id === employee.id
                            ? employee
                            : currentEmployee,
                    )
                    .sort(sortByContractEndDate),
            }));
        },
        [accessToken, databaseBranch],
    );

    const removeEmployee = useCallback(
        async (employeeId: string) => {
            if (!accessToken) {
                throw new Error('Employee storage is unavailable.');
            }

            await deleteEmployee(employeeId, { accessToken, databaseBranch });

            setState((current) => ({
                ...current,
                employees: current.employees.filter(
                    (employee) => employee.id !== employeeId,
                ),
            }));
        },
        [accessToken, databaseBranch],
    );

    return {
        addEmployee,
        deleteEmployee: removeEmployee,
        employees:
            state.accessToken === accessToken &&
            state.databaseBranch === databaseBranch
                ? state.employees
                : [],
        error:
            state.accessToken === accessToken &&
            state.databaseBranch === databaseBranch
                ? state.error
                : null,
        isLoading:
            Boolean(accessToken) &&
            (state.accessToken !== accessToken ||
                state.databaseBranch !== databaseBranch ||
                state.subscriptionKey !== subscriptionKey),
        retry: () => {
            setSubscriptionKey((key) => key + 1);
        },
        updateEmployee: saveEmployeeUpdate,
    };
}

function sortByContractEndDate(left: Employee, right: Employee): number {
    return left.contractEndDate.localeCompare(right.contractEndDate);
}
