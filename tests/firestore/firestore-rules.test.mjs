import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, beforeEach, describe, it } from 'node:test';

import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

const testEnv = await initializeTestEnvironment({
    projectId: 'contract-tracker-rules-test',
    firestore: {
        host: '127.0.0.1',
        port: 8080,
        rules: readFileSync('firestore.rules', 'utf8'),
    },
});

describe('Firestore security rules', () => {
    beforeEach(async () => {
        await testEnv.clearFirestore();
    });

    after(async () => {
        await testEnv.cleanup();
    });

    const employee = (ownerId = 'alice') => ({
        contractEndDate: '2026-12-31',
        contractStartDate: '2026-01-01',
        createdAt: '2026-06-04T10:30:00.000Z',
        iqamaEndDate: null,
        iqamaStartDate: '2026-02-01',
        name: 'Ahmed Ali',
        ownerId,
        updatedAt: '2026-06-04T10:30:00.000Z',
    });

    it('rejects unauthenticated access to employee documents', async () => {
        const db = testEnv.unauthenticatedContext().firestore();
        const employeeRef = doc(db, 'users/alice/employees/employee-1');
        const employeesRef = collection(db, 'users/alice/employees');

        await assertFails(getDoc(employeeRef));
        await assertFails(
            getDocs(query(employeesRef, orderBy('contractEndDate', 'asc'))),
        );
        await assertFails(setDoc(employeeRef, employee()));
    });

    it('allows authenticated users to CRUD their own employee documents', async () => {
        const db = testEnv.authenticatedContext('alice').firestore();
        const employeeRef = doc(db, 'users/alice/employees/employee-1');

        await assertSucceeds(setDoc(employeeRef, employee()));
        await assertSucceeds(getDoc(employeeRef));
        await assertSucceeds(
            updateDoc(employeeRef, {
                name: 'Ahmed Mahmoud',
                updatedAt: '2026-06-05T10:30:00.000Z',
            }),
        );
        await assertSucceeds(deleteDoc(employeeRef));
    });

    it('allows authenticated users to list their own employees by soonest contract end date', async () => {
        const db = testEnv.authenticatedContext('alice').firestore();
        const employeesRef = collection(db, 'users/alice/employees');

        await assertSucceeds(
            setDoc(doc(employeesRef, 'later'), {
                ...employee(),
                contractEndDate: '2026-12-31',
            }),
        );
        await assertSucceeds(
            setDoc(doc(employeesRef, 'sooner'), {
                ...employee(),
                contractEndDate: '2026-07-31',
                name: 'Sooner Employee',
            }),
        );

        const employeesQuery = query(
            employeesRef,
            orderBy('contractEndDate', 'asc'),
        );
        const snapshot = await assertSucceeds(getDocs(employeesQuery));

        assert.deepEqual(
            snapshot.docs.map((employeeDocument) => employeeDocument.id),
            ['sooner', 'later'],
        );
    });

    it('rejects authenticated access to another user employee documents', async () => {
        const aliceDb = testEnv.authenticatedContext('alice').firestore();
        const bobDb = testEnv.authenticatedContext('bob').firestore();
        const employeeRef = doc(aliceDb, 'users/alice/employees/employee-1');
        const bobEmployeeRef = doc(bobDb, 'users/alice/employees/employee-1');
        const bobEmployeesRef = collection(bobDb, 'users/alice/employees');

        await assertSucceeds(setDoc(employeeRef, employee()));
        await assertFails(getDoc(bobEmployeeRef));
        await assertFails(
            getDocs(query(bobEmployeesRef, orderBy('contractEndDate', 'asc'))),
        );
        await assertFails(setDoc(bobEmployeeRef, employee('bob')));
        await assertFails(deleteDoc(bobEmployeeRef));
    });

    it('rejects spoofed or changed employee ownership fields', async () => {
        const db = testEnv.authenticatedContext('alice').firestore();
        const spoofedOwnerRef = doc(db, 'users/alice/employees/spoofed-owner');
        const employeeRef = doc(db, 'users/alice/employees/employee-1');

        await assertFails(setDoc(spoofedOwnerRef, employee('bob')));
        await assertSucceeds(setDoc(employeeRef, employee()));
        await assertFails(updateDoc(employeeRef, { ownerId: 'bob' }));
    });

    it('rejects malformed employee documents and extra fields', async () => {
        const db = testEnv.authenticatedContext('alice').firestore();
        const missingNameRef = doc(db, 'users/alice/employees/missing-name');
        const extraFieldRef = doc(db, 'users/alice/employees/extra-field');
        const invalidDateRef = doc(db, 'users/alice/employees/invalid-date');

        const missingName = employee();
        delete missingName.name;

        await assertFails(setDoc(missingNameRef, missingName));
        await assertFails(
            setDoc(extraFieldRef, {
                ...employee(),
                role: 'manager',
            }),
        );
        await assertFails(
            setDoc(invalidDateRef, {
                ...employee(),
                contractEndDate: '31/12/2026',
            }),
        );
    });
});
