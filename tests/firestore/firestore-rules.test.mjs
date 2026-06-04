import { readFileSync } from 'node:fs';
import { after, beforeEach, describe, it } from 'node:test';

import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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

    it('rejects unauthenticated access to protected user data', async () => {
        const db = testEnv.unauthenticatedContext().firestore();
        const contractRef = doc(db, 'users/alice/contracts/contract-1');

        await assertFails(getDoc(contractRef));
        await assertFails(setDoc(contractRef, { ownerId: 'alice', title: 'Draft' }));
    });

    it('allows authenticated users to read and write their own protected data', async () => {
        const db = testEnv.authenticatedContext('alice').firestore();
        const contractRef = doc(db, 'users/alice/contracts/contract-1');

        await assertSucceeds(setDoc(contractRef, { ownerId: 'alice', title: 'Draft' }));
        await assertSucceeds(getDoc(contractRef));
    });

    it('rejects authenticated access to another user protected data', async () => {
        const aliceDb = testEnv.authenticatedContext('alice').firestore();
        const bobDb = testEnv.authenticatedContext('bob').firestore();
        const contractRef = doc(aliceDb, 'users/alice/contracts/contract-1');
        const bobContractRef = doc(bobDb, 'users/alice/contracts/contract-1');

        await assertSucceeds(setDoc(contractRef, { ownerId: 'alice', title: 'Draft' }));
        await assertFails(getDoc(bobContractRef));
    });

    it('rejects missing or changed owner fields', async () => {
        const db = testEnv.authenticatedContext('alice').firestore();
        const missingOwnerRef = doc(db, 'users/alice/contracts/missing-owner');
        const contractRef = doc(db, 'users/alice/contracts/contract-1');

        await assertFails(setDoc(missingOwnerRef, { title: 'Missing owner' }));
        await assertSucceeds(setDoc(contractRef, { ownerId: 'alice', title: 'Draft' }));
        await assertFails(updateDoc(contractRef, { ownerId: 'bob' }));
    });
});
