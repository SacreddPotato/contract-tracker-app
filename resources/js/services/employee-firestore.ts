import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
} from 'firebase/firestore';
import type { Firestore, Unsubscribe } from 'firebase/firestore';

import {
    buildEmployeeDocument,
    buildEmployeeUpdate,
} from '@/services/employee-records';
import type {
    Employee,
    EmployeeDocument,
    EmployeeFormValues,
} from '@/services/employee-records';

type EmployeeSubscriber = (employees: Employee[]) => void;
type EmployeeErrorHandler = (error: Error) => void;

export function subscribeToEmployees(
    firestore: Firestore,
    userId: string,
    onEmployees: EmployeeSubscriber,
    onError: EmployeeErrorHandler,
): Unsubscribe {
    const employeesQuery = query(
        collection(firestore, 'users', userId, 'employees'),
        orderBy('contractEndDate', 'asc'),
    );

    return onSnapshot(
        employeesQuery,
        (snapshot) => {
            onEmployees(
                snapshot.docs.map((employeeDocument) => ({
                    ...(employeeDocument.data() as EmployeeDocument),
                    id: employeeDocument.id,
                })),
            );
        },
        onError,
    );
}

export async function createEmployee(
    firestore: Firestore,
    userId: string,
    values: EmployeeFormValues,
): Promise<void> {
    await addDoc(
        collection(firestore, 'users', userId, 'employees'),
        buildEmployeeDocument(values, userId),
    );
}

export async function updateEmployee(
    firestore: Firestore,
    userId: string,
    employeeId: string,
    values: EmployeeFormValues,
): Promise<void> {
    await updateDoc(
        doc(firestore, 'users', userId, 'employees', employeeId),
        buildEmployeeUpdate(values),
    );
}

export async function deleteEmployee(
    firestore: Firestore,
    userId: string,
    employeeId: string,
): Promise<void> {
    await deleteDoc(doc(firestore, 'users', userId, 'employees', employeeId));
}
