import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import {
    buildEmployeeDocument,
    buildEmployeeUpdate,
    contractDaysLeft,
    contractStatusForDate,
    daysLeftUntil,
    employeeToFormValues,
    validateEmployeeForm,
} from '../../resources/js/services/employee-records.ts';
import {
    buildEmployeeExportMatrix,
    buildEmployeeTableRows,
    employeeExportColumnKeys,
    getNextEmployeeSort,
} from '../../resources/js/services/employee-table.ts';
import type { EmployeeSortState } from '../../resources/js/services/employee-table.ts';

const today = new Date(2026, 5, 4);
const dashboardSource = readFileSync(
    new URL(
        '../../resources/js/components/employee-dashboard.tsx',
        import.meta.url,
    ),
    'utf8',
);

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

test('generic days left supports optional iqama end dates', () => {
    assert.equal(daysLeftUntil('2026-06-14', today), 10);
    assert.equal(daysLeftUntil(null, today), null);
});

const tableEmployees = [
    employeeFixture({
        contractEndDate: '2026-06-20',
        id: '1',
        iqamaEndDate: '2026-08-01',
        name: 'Mona Ali',
    }),
    employeeFixture({
        contractEndDate: '2026-09-20',
        id: '2',
        iqamaEndDate: '2026-06-15',
        name: 'Ahmed Hassan',
    }),
    employeeFixture({
        contractEndDate: '2026-07-10',
        id: '3',
        iqamaEndDate: null,
        name: 'Sara Nabil',
    }),
];

test('employee table search filters by name only', () => {
    const rows = buildEmployeeTableRows(tableEmployees, {
        contractDeadlineFilter: null,
        iqamaDeadlineFilter: null,
        searchQuery: 'ahmed',
        sort: null,
        today,
    });

    assert.deepEqual(
        rows.map((row) => row.employee.name),
        ['Ahmed Hassan'],
    );
});

test('employee table deadline filters combine contract and iqama thresholds with and logic', () => {
    const rows = buildEmployeeTableRows(tableEmployees, {
        contractDeadlineFilter: 90,
        iqamaDeadlineFilter: 60,
        searchQuery: '',
        sort: null,
        today,
    });

    assert.deepEqual(
        rows.map((row) => row.employee.name),
        ['Mona Ali'],
    );
});

test('missing iqama deadlines do not match iqama deadline filters', () => {
    const rows = buildEmployeeTableRows(tableEmployees, {
        contractDeadlineFilter: null,
        iqamaDeadlineFilter: 90,
        searchQuery: '',
        sort: null,
        today,
    });

    assert.deepEqual(
        rows.map((row) => row.employee.name),
        ['Mona Ali', 'Ahmed Hassan'],
    );
});

test('employee table sorts names ascending and deadline columns descending first', () => {
    const nameSort: EmployeeSortState = { column: 'name', direction: 'asc' };
    const deadlineSort: EmployeeSortState = {
        column: 'contractTimeLeft',
        direction: 'desc',
    };

    assert.deepEqual(
        buildEmployeeTableRows(tableEmployees, {
            contractDeadlineFilter: null,
            iqamaDeadlineFilter: null,
            searchQuery: '',
            sort: nameSort,
            today,
        }).map((row) => row.employee.name),
        ['Ahmed Hassan', 'Mona Ali', 'Sara Nabil'],
    );
    assert.deepEqual(
        buildEmployeeTableRows(tableEmployees, {
            contractDeadlineFilter: null,
            iqamaDeadlineFilter: null,
            searchQuery: '',
            sort: deadlineSort,
            today,
        }).map((row) => row.employee.name),
        ['Ahmed Hassan', 'Sara Nabil', 'Mona Ali'],
    );
});

test('employee sort toggles normal columns ascending first and deadline columns descending first', () => {
    assert.deepEqual(getNextEmployeeSort(null, 'name'), {
        column: 'name',
        direction: 'asc',
    });
    assert.deepEqual(getNextEmployeeSort(null, 'iqamaTimeLeft'), {
        column: 'iqamaTimeLeft',
        direction: 'desc',
    });
    assert.deepEqual(
        getNextEmployeeSort(
            { column: 'iqamaTimeLeft', direction: 'desc' },
            'iqamaTimeLeft',
        ),
        {
            column: 'iqamaTimeLeft',
            direction: 'asc',
        },
    );
});

test('employee export matrix uses selected localized columns', () => {
    const rows = buildEmployeeTableRows(tableEmployees, {
        contractDeadlineFilter: null,
        iqamaDeadlineFilter: null,
        searchQuery: 'mona',
        sort: null,
        today,
    });
    const columns = employeeExportColumnKeys.filter((column) =>
        ['name', 'contractTimeLeft', 'iqamaTimeLeft'].includes(column),
    );
    const translations: Record<string, string> = {
        contractDaysExpired: 'متأخر {count} يوم',
        contractDaysLeft: 'متبقي {count} يوم',
        contractEndsToday: 'ينتهي اليوم',
        employeeName: 'اسم الموظف',
        tableContract: 'العقد',
        tableIqama: 'الإقامة',
        tableTimeUntilContractEnd: 'المدة حتى نهاية العقد',
        tableTimeUntilIqamaEnd: 'المدة حتى نهاية الإقامة',
    };

    assert.deepEqual(
        buildEmployeeExportMatrix(rows, columns, {
            direction: 'rtl',
            notSetLabel: 'غير محدد',
            t: (key, replacements = {}) => {
                let message = translations[key] ?? key;

                for (const [replacementKey, replacementValue] of Object.entries(
                    replacements,
                )) {
                    message = message.replace(
                        `{${replacementKey}}`,
                        String(replacementValue),
                    );
                }

                return message;
            },
        }),
        [
            ['اسم الموظف', 'المدة حتى نهاية العقد', 'المدة حتى نهاية الإقامة'],
            ['Mona Ali', 'متبقي 16 يوم', 'متبقي 58 يوم'],
        ],
    );
});

test('employee desktop table stretches page width instead of using an internal scrollbar', () => {
    assert.doesNotMatch(dashboardSource, /overflow-x-auto/);
    assert.doesNotMatch(dashboardSource, /max-w-6xl/);
    assert.doesNotMatch(dashboardSource, /overflow-hidden rounded-md border/);
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

function employeeFixture(
    overrides: Partial<Parameters<typeof employeeToFormValues>[0]>,
): Parameters<typeof employeeToFormValues>[0] {
    return {
        contractEndDate: '2026-12-31',
        contractStartDate: '2026-01-01',
        createdAt: '2026-06-04T10:30:00.000Z',
        email: null,
        id: 'employee-1',
        iqamaEndDate: null,
        iqamaStartDate: null,
        name: 'Employee',
        nationality: null,
        ownerId: '0',
        phoneNumber: null,
        updatedAt: '2026-06-04T10:30:00.000Z',
        ...overrides,
    };
}
