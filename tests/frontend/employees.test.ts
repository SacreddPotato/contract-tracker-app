import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    buildEmployeeDocument,
    contractDaysLeft,
    contractStatusForDate,
    validateEmployeeForm,
} from '../../resources/js/services/employee-records.ts';

const today = new Date(2026, 5, 4);

test('contract status is green when the end date is more than 3 months away', () => {
    assert.equal(contractStatusForDate('2026-09-05', today), 'green');
});

test('contract status is yellow between 1 and 3 months away inclusively', () => {
    assert.equal(contractStatusForDate('2026-07-04', today), 'yellow');
    assert.equal(contractStatusForDate('2026-09-04', today), 'yellow');
});

test('contract status is red when less than 1 month away or expired', () => {
    assert.equal(contractStatusForDate('2026-07-03', today), 'red');
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
        iqamaEndDate: '',
        iqamaStartDate: '',
        name: '   ',
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
            iqamaEndDate: '',
            iqamaStartDate: '2026-02-01',
            name: '  Ahmed Ali  ',
        },
        'user-123',
        '2026-06-04T10:30:00.000Z',
    );

    assert.deepEqual(payload, {
        contractEndDate: '2026-12-31',
        contractStartDate: '2026-01-01',
        createdAt: '2026-06-04T10:30:00.000Z',
        iqamaEndDate: null,
        iqamaStartDate: '2026-02-01',
        name: 'Ahmed Ali',
        ownerId: 'user-123',
        updatedAt: '2026-06-04T10:30:00.000Z',
    });
});
