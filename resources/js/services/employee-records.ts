export type ContractStatus = 'green' | 'yellow' | 'red' | 'orange';

export type EmployeeFormValues = {
    name: string;
    contractStartDate: string;
    contractEndDate: string;
    iqamaStartDate: string;
    iqamaEndDate: string;
};

export type EmployeeValidationErrorKey =
    | 'nameRequired'
    | 'contractStartDateRequired'
    | 'contractEndDateRequired'
    | 'contractStartDateInvalid'
    | 'contractEndDateInvalid'
    | 'iqamaStartDateInvalid'
    | 'iqamaEndDateInvalid';

export type EmployeeFormErrors = Partial<
    Record<keyof EmployeeFormValues, EmployeeValidationErrorKey>
>;

export type EmployeeValidationResult =
    | {
          errors: EmployeeFormErrors;
          valid: false;
      }
    | {
          errors: EmployeeFormErrors;
          values: EmployeeFormValues;
          valid: true;
      };

export type EmployeeDocument = {
    ownerId: string;
    name: string;
    contractStartDate: string;
    contractEndDate: string;
    iqamaStartDate: string | null;
    iqamaEndDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export type Employee = EmployeeDocument & {
    id: string;
};

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export const emptyEmployeeFormValues: EmployeeFormValues = {
    contractEndDate: '',
    contractStartDate: '',
    iqamaEndDate: '',
    iqamaStartDate: '',
    name: '',
};

export function contractStatusForDate(
    contractEndDate: string,
    today = new Date(),
): ContractStatus {
    const endDate = parseDateOnly(contractEndDate);
    const oneMonthAway = addCalendarMonths(startOfLocalDay(today), 1);
    const twoMonthsAway = addCalendarMonths(startOfLocalDay(today), 2);
    const threeMonthsAway = addCalendarMonths(startOfLocalDay(today), 3);

    if (endDate < oneMonthAway) {
        return 'red';
    }

    if (endDate < twoMonthsAway) {
        return 'yellow';
    }

    if (endDate <= threeMonthsAway) {
        return 'orange';
    }

    return 'green';
}

export function contractDaysLeft(
    contractEndDate: string,
    today = new Date(),
): number {
    const endDate = parseDateOnly(contractEndDate);
    const currentDate = startOfLocalDay(today);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    return Math.round(
        (endDate.getTime() - currentDate.getTime()) / millisecondsPerDay,
    );
}

export function validateEmployeeForm(
    values: EmployeeFormValues,
): EmployeeValidationResult {
    const normalizedValues = normalizeEmployeeForm(values);
    const errors: EmployeeFormErrors = {};

    if (!normalizedValues.name) {
        errors.name = 'nameRequired';
    }

    validateRequiredDate(
        normalizedValues.contractStartDate,
        'contractStartDate',
        'contractStartDateRequired',
        'contractStartDateInvalid',
        errors,
    );
    validateRequiredDate(
        normalizedValues.contractEndDate,
        'contractEndDate',
        'contractEndDateRequired',
        'contractEndDateInvalid',
        errors,
    );
    validateOptionalDate(
        normalizedValues.iqamaStartDate,
        'iqamaStartDate',
        'iqamaStartDateInvalid',
        errors,
    );
    validateOptionalDate(
        normalizedValues.iqamaEndDate,
        'iqamaEndDate',
        'iqamaEndDateInvalid',
        errors,
    );

    if (Object.keys(errors).length > 0) {
        return {
            errors,
            valid: false,
        };
    }

    return {
        errors,
        valid: true,
        values: normalizedValues,
    };
}

export function buildEmployeeDocument(
    values: EmployeeFormValues,
    ownerId: string,
    timestamp = new Date().toISOString(),
): EmployeeDocument {
    const result = validateEmployeeForm(values);

    if (!result.valid) {
        throw new Error('Employee form values are invalid.');
    }

    return {
        contractEndDate: result.values.contractEndDate,
        contractStartDate: result.values.contractStartDate,
        createdAt: timestamp,
        iqamaEndDate: nullableDate(result.values.iqamaEndDate),
        iqamaStartDate: nullableDate(result.values.iqamaStartDate),
        name: result.values.name,
        ownerId,
        updatedAt: timestamp,
    };
}

export function buildEmployeeUpdate(
    values: EmployeeFormValues,
    timestamp = new Date().toISOString(),
): Omit<EmployeeDocument, 'createdAt' | 'ownerId'> {
    const result = validateEmployeeForm(values);

    if (!result.valid) {
        throw new Error('Employee form values are invalid.');
    }

    return {
        contractEndDate: result.values.contractEndDate,
        contractStartDate: result.values.contractStartDate,
        iqamaEndDate: nullableDate(result.values.iqamaEndDate),
        iqamaStartDate: nullableDate(result.values.iqamaStartDate),
        name: result.values.name,
        updatedAt: timestamp,
    };
}

export function employeeToFormValues(employee: Employee): EmployeeFormValues {
    return {
        contractEndDate: employee.contractEndDate,
        contractStartDate: employee.contractStartDate,
        iqamaEndDate: employee.iqamaEndDate ?? '',
        iqamaStartDate: employee.iqamaStartDate ?? '',
        name: employee.name,
    };
}

function normalizeEmployeeForm(values: EmployeeFormValues): EmployeeFormValues {
    return {
        contractEndDate: values.contractEndDate.trim(),
        contractStartDate: values.contractStartDate.trim(),
        iqamaEndDate: values.iqamaEndDate.trim(),
        iqamaStartDate: values.iqamaStartDate.trim(),
        name: values.name.trim(),
    };
}

function validateRequiredDate(
    value: string,
    field: keyof EmployeeFormValues,
    requiredKey: EmployeeValidationErrorKey,
    invalidKey: EmployeeValidationErrorKey,
    errors: EmployeeFormErrors,
): void {
    if (!value) {
        errors[field] = requiredKey;

        return;
    }

    if (!isDateOnly(value)) {
        errors[field] = invalidKey;
    }
}

function validateOptionalDate(
    value: string,
    field: keyof EmployeeFormValues,
    invalidKey: EmployeeValidationErrorKey,
    errors: EmployeeFormErrors,
): void {
    if (value && !isDateOnly(value)) {
        errors[field] = invalidKey;
    }
}

function isDateOnly(value: string): boolean {
    if (!dateOnlyPattern.test(value)) {
        return false;
    }

    const parsed = parseDateOnly(value);

    return formatDateOnly(parsed) === value;
}

function nullableDate(value: string): string | null {
    return value === '' ? null : value;
}

function parseDateOnly(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

function formatDateOnly(value: Date): string {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, '0');
    const day = `${value.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function startOfLocalDay(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function addCalendarMonths(value: Date, months: number): Date {
    const result = new Date(value);
    const originalDay = result.getDate();

    result.setMonth(result.getMonth() + months);

    if (result.getDate() !== originalDay) {
        result.setDate(0);
    }

    return result;
}
