import { useCallback, useEffect, useState } from 'react';

import { firebaseRuntime } from '@/lib/firebase';
import {
    createEmployee,
    deleteEmployee,
    subscribeToEmployees,
    updateEmployee,
} from '@/services/employee-firestore';
import type { Employee, EmployeeFormValues } from '@/services/employee-records';

type EmployeeSubscriptionState = {
    employees: Employee[];
    error: Error | null;
    subscriptionKey: number;
    userId: string | null;
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

export function useEmployees(userId: string | null): EmployeesState {
    const [state, setState] = useState<EmployeeSubscriptionState>({
        employees: [],
        error: null,
        subscriptionKey: 0,
        userId: null,
    });
    const [subscriptionKey, setSubscriptionKey] = useState(0);

    useEffect(() => {
        if (!userId || !firebaseRuntime) {
            return;
        }

        return subscribeToEmployees(
            firebaseRuntime.firestore,
            userId,
            (nextEmployees) => {
                setState({
                    employees: nextEmployees,
                    error: null,
                    subscriptionKey,
                    userId,
                });
            },
            (nextError) => {
                setState({
                    employees: [],
                    error: nextError,
                    subscriptionKey,
                    userId,
                });
            },
        );
    }, [subscriptionKey, userId]);

    const addEmployee = useCallback(
        async (values: EmployeeFormValues) => {
            if (!userId || !firebaseRuntime) {
                throw new Error('Employee storage is unavailable.');
            }

            await createEmployee(firebaseRuntime.firestore, userId, values);
        },
        [userId],
    );

    const saveEmployeeUpdate = useCallback(
        async (employeeId: string, values: EmployeeFormValues) => {
            if (!userId || !firebaseRuntime) {
                throw new Error('Employee storage is unavailable.');
            }

            await updateEmployee(
                firebaseRuntime.firestore,
                userId,
                employeeId,
                values,
            );
        },
        [userId],
    );

    const removeEmployee = useCallback(
        async (employeeId: string) => {
            if (!userId || !firebaseRuntime) {
                throw new Error('Employee storage is unavailable.');
            }

            await deleteEmployee(firebaseRuntime.firestore, userId, employeeId);
        },
        [userId],
    );

    return {
        addEmployee,
        deleteEmployee: removeEmployee,
        employees: state.userId === userId ? state.employees : [],
        error: state.userId === userId ? state.error : null,
        isLoading:
            Boolean(userId) &&
            (state.userId !== userId ||
                state.subscriptionKey !== subscriptionKey),
        retry: () => {
            setSubscriptionKey((key) => key + 1);
        },
        updateEmployee: saveEmployeeUpdate,
    };
}
