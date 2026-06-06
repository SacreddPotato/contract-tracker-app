import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    buildEmployeeDocument,
    buildEmployeeUpdate,
    contractDaysLeft,
    contractStatusForDate,
    employeeToFormValues,
    validateEmployeeForm,
} from '../../resources/js/services/employee-records.ts';

const today = new Date(2026, 5, 4);

test('contract status is green when the end date is more than 90 days away', () => {
    assert.equal(contractStatusForDate('2026-09-03', today), 'green');
});

test('contract status is yellow between 61 and 90 days away inclusively', () => {
    assert.equal(contractStatusForDate('2026-08-04', today), 'yellow');
    assert.equal(contractStatusForDate('2026-09-02', today), 'yellow');
});

test('contract status is orange between 31 and 60 days away inclusively', () => {
    assert.equal(contractStatusForDate('2026-07-05', today), 'orange');
    assert.equal(contractStatusForDate('2026-08-03', today), 'orange');
});

test('contract status is red when 30 days away or expired', () => {
    assert.equal(contractStatusForDate('2026-07-04', today), 'red');
    assert.equal(contractStatusForDate('2026-05-20', today), 'red');
});

test('contract days left counts calendar days until the contract end date', () => {
    assert.equal(contractDaysLeft('2026-06-14', today), 10);
    assert.equal(contractDaysLeft('2026-06-04', today), 0);
    assert.equal(contractDaysLeft('2026-06-01', today), -3);
});

test('employee form validation trims names and requires contract dates', () => {
    const result = validateEmployeeForm({
        contractEndDate: '',
        contractStartDate: '',
        email: '',
        iqamaEndDate: '',
        iqamaStartDate: '',
        name: '   ',
        nationality: '',
        phoneNumber: '',
    });

    assert.equal(result.valid, false);
    assert.deepEqual(result.errors, {
        contractEndDate: 'contractEndDateRequired',
        contractStartDate: 'contractStartDateRequired',
        name: 'nameRequired',
    });
});

test('employee document payload stores date-only values and nullable iqama dates', () => {
    const payload = buildEmployeeDocument(
        {
            contractEndDate: '2026-12-31',
            contractStartDate: '2026-01-01',
            email: '  ahmed@example.com  ',
            iqamaEndDate: '',
            iqamaStartDate: '2026-02-01',
            name: '  Ahmed Ali  ',
            nationality: '  Egyptian  ',
            phoneNumber: '  +20 100 000 0000  ',
        },
        'user-123',
        '2026-06-04T10:30:00.000Z',
    );

    assert.deepEqual(payload, {
        contractEndDate: '2026-12-31',
        contractStartDate: '2026-01-01',
        createdAt: '2026-06-04T10:30:00.000Z',
        email: 'ahmed@example.com',
        iqamaEndDate: null,
        iqamaStartDate: '2026-02-01',
        name: 'Ahmed Ali',
        nationality: 'Egyptian',
        ownerId: 'user-123',
        phoneNumber: '+20 100 000 0000',
        updatedAt: '2026-06-04T10:30:00.000Z',
    });
});

test('employee optional details normalize empty values to null for updates', () => {
    const payload = buildEmployeeUpdate(
        {
            contractEndDate: '2026-12-31',
            contractStartDate: '2026-01-01',
            email: '',
            iqamaEndDate: '',
            iqamaStartDate: '',
            name: 'Ahmed Ali',
            nationality: '   ',
            phoneNumber: '',
        },
        '2026-06-04T10:30:00.000Z',
    );

    assert.deepEqual(payload, {
        contractEndDate: '2026-12-31',
        contractStartDate: '2026-01-01',
        email: null,
        iqamaEndDate: null,
        iqamaStartDate: null,
        name: 'Ahmed Ali',
        nationality: null,
        phoneNumber: null,
        updatedAt: '2026-06-04T10:30:00.000Z',
    });
});

test('employee form validation rejects invalid optional email values', () => {
    const result = validateEmployeeForm({
        contractEndDate: '2026-12-31',
        contractStartDate: '2026-01-01',
        email: 'not-an-email',
        iqamaEndDate: '',
        iqamaStartDate: '',
        name: 'Ahmed Ali',
        nationality: '',
        phoneNumber: '',
    });

    assert.equal(result.valid, false);
    assert.deepEqual(result.errors, {
        email: 'employeeEmailInvalid',
    });
});

test('employee form values include optional employee details', () => {
    assert.deepEqual(
        employeeToFormValues({
            contractEndDate: '2026-12-31',
            contractStartDate: '2026-01-01',
            createdAt: '2026-06-04T10:30:00.000Z',
            email: 'ahmed@example.com',
            id: 'employee-1',
            iqamaEndDate: null,
            iqamaStartDate: null,
            name: 'Ahmed Ali',
            nationality: 'Egyptian',
            ownerId: '0',
            phoneNumber: '+20 100 000 0000',
            updatedAt: '2026-06-04T10:30:00.000Z',
        }),
        {
            contractEndDate: '2026-12-31',
            contractStartDate: '2026-01-01',
            email: 'ahmed@example.com',
            iqamaEndDate: '',
            iqamaStartDate: '',
            name: 'Ahmed Ali',
            nationality: 'Egyptian',
            phoneNumber: '+20 100 000 0000',
        },
    );
});
