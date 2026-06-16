import type { TranslationKey } from '@/i18n';
import { daysLeftUntil } from './employee-records.ts';
import type { Employee } from './employee-records.ts';

export type EmployeeSortDirection = 'asc' | 'desc';

export type EmployeeSortColumn =
    | 'contractRange'
    | 'contractTimeLeft'
    | 'iqamaRange'
    | 'iqamaTimeLeft'
    | 'name';

export type EmployeeSortState = {
    column: EmployeeSortColumn;
    direction: EmployeeSortDirection;
};

export type EmployeeDeadlineFilter = 30 | 60 | 90;

export type EmployeeTableOptions = {
    contractDeadlineFilter: EmployeeDeadlineFilter | null;
    iqamaDeadlineFilter: EmployeeDeadlineFilter | null;
    searchQuery: string;
    sort: EmployeeSortState | null;
    today?: Date;
};

export type EmployeeTableRow = {
    contractDaysLeft: number;
    employee: Employee;
    iqamaDaysLeft: number | null;
};

export const employeeExportColumnKeys = [
    'name',
    'contractRange',
    'iqamaRange',
    'contractTimeLeft',
    'iqamaTimeLeft',
] as const;

export type EmployeeExportColumnKey = (typeof employeeExportColumnKeys)[number];

type EmployeeExportOptions = {
    direction: 'ltr' | 'rtl';
    notSetLabel: string;
    t: (
        key: TranslationKey,
        replacements?: Partial<Record<'count', string | number>>,
    ) => string;
};

const deadlineSortColumns: EmployeeSortColumn[] = [
    'contractTimeLeft',
    'iqamaTimeLeft',
];

export const employeeExportColumnLabelKeys: Record<
    EmployeeExportColumnKey,
    TranslationKey
> = {
    contractRange: 'tableContract',
    contractTimeLeft: 'tableTimeUntilContractEnd',
    iqamaRange: 'tableIqama',
    iqamaTimeLeft: 'tableTimeUntilIqamaEnd',
    name: 'employeeName',
};

export function buildEmployeeTableRows(
    employees: Employee[],
    options: EmployeeTableOptions,
): EmployeeTableRow[] {
    const searchQuery = options.searchQuery.trim().toLocaleLowerCase();
    const rows = employees
        .map((employee) => ({
            contractDaysLeft:
                daysLeftUntil(employee.contractEndDate, options.today) ?? 0,
            employee,
            iqamaDaysLeft: daysLeftUntil(employee.iqamaEndDate, options.today),
        }))
        .filter((row) => {
            if (
                searchQuery &&
                !row.employee.name.toLocaleLowerCase().includes(searchQuery)
            ) {
                return false;
            }

            if (
                options.contractDeadlineFilter !== null &&
                row.contractDaysLeft > options.contractDeadlineFilter
            ) {
                return false;
            }

            if (
                options.iqamaDeadlineFilter !== null &&
                (row.iqamaDaysLeft === null ||
                    row.iqamaDaysLeft > options.iqamaDeadlineFilter)
            ) {
                return false;
            }

            return true;
        });

    const sort = options.sort;

    if (!sort) {
        return rows;
    }

    return [...rows].sort((left, right) => compareRows(left, right, sort));
}

export function getNextEmployeeSort(
    currentSort: EmployeeSortState | null,
    column: EmployeeSortColumn,
): EmployeeSortState {
    if (currentSort?.column === column) {
        return {
            column,
            direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
        };
    }

    return {
        column,
        direction: deadlineSortColumns.includes(column) ? 'desc' : 'asc',
    };
}

export function buildEmployeeExportMatrix(
    rows: EmployeeTableRow[],
    columns: EmployeeExportColumnKey[],
    options: EmployeeExportOptions,
): string[][] {
    return [
        columns.map((column) =>
            options.t(employeeExportColumnLabelKeys[column]),
        ),
        ...rows.map((row) =>
            columns.map((column) => exportValueForColumn(row, column, options)),
        ),
    ];
}

function compareRows(
    left: EmployeeTableRow,
    right: EmployeeTableRow,
    sort: EmployeeSortState,
): number {
    const multiplier = sort.direction === 'asc' ? 1 : -1;
    let comparison = 0;

    if (sort.column === 'name') {
        comparison = left.employee.name.localeCompare(right.employee.name);
    } else if (sort.column === 'contractRange') {
        comparison = left.employee.contractEndDate.localeCompare(
            right.employee.contractEndDate,
        );
    } else if (sort.column === 'iqamaRange') {
        comparison = compareNullableString(
            left.employee.iqamaEndDate,
            right.employee.iqamaEndDate,
            sort.direction,
        );
    } else if (sort.column === 'contractTimeLeft') {
        comparison = left.contractDaysLeft - right.contractDaysLeft;
    } else {
        comparison = compareNullableNumber(
            left.iqamaDaysLeft,
            right.iqamaDaysLeft,
            sort.direction,
        );
    }

    if (comparison === 0) {
        return left.employee.name.localeCompare(right.employee.name);
    }

    return comparison * multiplier;
}

function compareNullableNumber(
    left: number | null,
    right: number | null,
    direction: EmployeeSortDirection,
): number {
    if (left === null && right === null) {
        return 0;
    }

    if (left === null) {
        return direction === 'asc' ? 1 : -1;
    }

    if (right === null) {
        return direction === 'asc' ? -1 : 1;
    }

    return left - right;
}

function compareNullableString(
    left: string | null,
    right: string | null,
    direction: EmployeeSortDirection,
): number {
    if (left === null && right === null) {
        return 0;
    }

    if (left === null) {
        return direction === 'asc' ? 1 : -1;
    }

    if (right === null) {
        return direction === 'asc' ? -1 : 1;
    }

    return left.localeCompare(right);
}

function exportValueForColumn(
    row: EmployeeTableRow,
    column: EmployeeExportColumnKey,
    options: EmployeeExportOptions,
): string {
    if (column === 'name') {
        return row.employee.name;
    }

    if (column === 'contractRange') {
        return `${formatDate(row.employee.contractStartDate, options.direction)} - ${formatDate(row.employee.contractEndDate, options.direction)}`;
    }

    if (column === 'iqamaRange') {
        return formatOptionalRange(
            row.employee.iqamaStartDate,
            row.employee.iqamaEndDate,
            options.direction,
            options.notSetLabel,
        );
    }

    if (column === 'contractTimeLeft') {
        return formatDaysLeft(row.contractDaysLeft, options.t);
    }

    return row.iqamaDaysLeft === null
        ? options.notSetLabel
        : formatDaysLeft(row.iqamaDaysLeft, options.t);
}

export function formatDaysLeft(
    daysLeft: number,
    t: (
        key: TranslationKey,
        replacements?: Partial<Record<'count', string | number>>,
    ) => string,
): string {
    if (daysLeft < 0) {
        return t('contractDaysExpired', { count: Math.abs(daysLeft) });
    }

    if (daysLeft === 0) {
        return t('contractEndsToday');
    }

    return t('contractDaysLeft', { count: daysLeft });
}

export function formatDate(value: string, direction: 'ltr' | 'rtl'): string {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);

    return new Intl.DateTimeFormat(direction === 'rtl' ? 'ar-EG' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

export function formatOptionalRange(
    startDate: string | null,
    endDate: string | null,
    direction: 'ltr' | 'rtl',
    fallback: string,
): string {
    if (!startDate && !endDate) {
        return fallback;
    }

    return `${startDate ? formatDate(startDate, direction) : fallback} - ${
        endDate ? formatDate(endDate, direction) : fallback
    }`;
}
