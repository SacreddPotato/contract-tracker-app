import {
    AlertCircle,
    Languages,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useEmployees } from '@/hooks/use-employees';
import { useSupabaseAnonymousUser } from '@/hooks/use-supabase-anonymous-user';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { cn } from '@/lib/utils';
import {
    contractDaysLeft,
    contractStatusForDate,
    employeeToFormValues,
    emptyEmployeeFormValues,
    validateEmployeeForm,
} from '@/services/employee-records';
import type {
    ContractStatus,
    Employee,
    EmployeeFormErrors,
    EmployeeFormValues,
    EmployeeValidationErrorKey,
} from '@/services/employee-records';

type EmployeeFormDialogProps = {
    employee: Employee | null;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: EmployeeFormValues) => Promise<void>;
    open: boolean;
};

const statusClasses: Record<ContractStatus, string> = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
    yellow: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
};

export function EmployeeDashboard({
    nativeChrome = false,
}: {
    nativeChrome?: boolean;
}) {
    const { direction, language, setLanguage, t } = useI18n();
    const auth = useSupabaseAnonymousUser();
    const employeesState = useEmployees(auth.session?.access_token ?? null);
    const [formOpen, setFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
        null,
    );
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
        null,
    );
    const [isDeletingEmployee, setIsDeletingEmployee] = useState(false);

    const employeeCount = employeesState.employees.length;

    function openCreateDialog() {
        setEditingEmployee(null);
        setFormOpen(true);
    }

    function openEditDialog(employee: Employee) {
        setEditingEmployee(employee);
        setFormOpen(true);
    }

    async function saveEmployee(values: EmployeeFormValues) {
        if (editingEmployee) {
            await employeesState.updateEmployee(editingEmployee.id, values);
        } else {
            await employeesState.addEmployee(values);
        }
    }

    async function confirmRemoveEmployee() {
        if (!deletingEmployee) {
            return;
        }

        setIsDeletingEmployee(true);

        try {
            await employeesState.deleteEmployee(deletingEmployee.id);
            setDeletingEmployee(null);
        } finally {
            setIsDeletingEmployee(false);
        }
    }

    return (
        <main
            className={cn(
                'bg-background text-foreground',
                nativeChrome ? 'min-h-[calc(100vh-2.5rem)]' : 'min-h-screen',
            )}
        >
            <section
                className={cn(
                    'mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8',
                    nativeChrome
                        ? 'min-h-[calc(100vh-2.5rem)]'
                        : 'min-h-screen',
                )}
            >
                <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                            {t('dashboardTitle')}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            {t('dashboardSubtitle')}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            aria-label={t('language')}
                            onClick={() => {
                                setLanguage(language === 'en' ? 'ar' : 'en');
                            }}
                            type="button"
                            variant="outline"
                        >
                            <Languages className="size-4" />
                            {language === 'en'
                                ? t('languageArabic')
                                : t('languageEnglish')}
                        </Button>
                        <Button
                            disabled={!auth.user}
                            onClick={openCreateDialog}
                            type="button"
                        >
                            <Plus className="size-4" />
                            {t('addEmployee')}
                        </Button>
                    </div>
                </header>

                {auth.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                            {auth.errorReason === 'configurationMissing'
                                ? t('supabaseMissing')
                                : auth.errorReason === 'anonymousSignInFailed'
                                  ? t('anonymousAuthUnavailable')
                                  : t('authStateUnavailable')}
                        </AlertDescription>
                    </Alert>
                )}

                {employeesState.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span>{t('loadEmployeesError')}</span>
                            <Button
                                onClick={employeesState.retry}
                                size="sm"
                                type="button"
                                variant="outline"
                            >
                                <RefreshCw className="size-4" />
                                {t('retry')}
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <section className="flex-1">
                    {auth.isLoading || employeesState.isLoading ? (
                        <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-muted-foreground">
                            <Spinner className="size-5" />
                            <span>
                                {auth.isLoading
                                    ? t('authLoading')
                                    : t('loadingEmployees')}
                            </span>
                        </div>
                    ) : employeeCount === 0 ? (
                        <EmptyEmployees onAdd={openCreateDialog} />
                    ) : (
                        <EmployeeList
                            direction={direction}
                            employees={employeesState.employees}
                            onDelete={(employee) => {
                                setDeletingEmployee(employee);
                            }}
                            onEdit={openEditDialog}
                        />
                    )}
                </section>
            </section>

            {formOpen && (
                <EmployeeFormDialog
                    employee={editingEmployee}
                    key={editingEmployee?.id ?? 'new'}
                    onOpenChange={(open) => {
                        setFormOpen(open);

                        if (!open) {
                            setEditingEmployee(null);
                        }
                    }}
                    onSubmit={saveEmployee}
                    open={formOpen}
                />
            )}
            <DeleteEmployeeDialog
                employee={deletingEmployee}
                isDeleting={isDeletingEmployee}
                onConfirm={() => {
                    void confirmRemoveEmployee();
                }}
                onOpenChange={(open) => {
                    if (!open && !isDeletingEmployee) {
                        setDeletingEmployee(null);
                    }
                }}
            />
        </main>
    );
}

function EmptyEmployees({ onAdd }: { onAdd: () => void }) {
    const { t } = useI18n();

    return (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed px-6 text-center">
            <h2 className="text-lg font-medium">{t('emptyTitle')}</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {t('emptyDescription')}
            </p>
            <Button className="mt-5" onClick={onAdd} type="button">
                <Plus className="size-4" />
                {t('addEmployee')}
            </Button>
        </div>
    );
}

function EmployeeList({
    direction,
    employees,
    onDelete,
    onEdit,
}: {
    direction: 'ltr' | 'rtl';
    employees: Employee[];
    onDelete: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
}) {
    const { t } = useI18n();

    return (
        <div className="overflow-hidden rounded-md border">
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-195 text-center text-sm">
                    <thead className="border-b bg-muted/60 text-muted-foreground">
                        <tr className="text-center">
                            <TableHeader>{t('tableEmployee')}</TableHeader>
                            <TableHeader>{t('tableContract')}</TableHeader>
                            <TableHeader>{t('tableIqama')}</TableHeader>
                            <TableHeader>{t('tableStatus')}</TableHeader>
                            <TableHeader className="text-center">
                                {t('tableActions')}
                            </TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <EmployeeRow
                                direction={direction}
                                employee={employee}
                                key={employee.id}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="divide-y md:hidden">
                {employees.map((employee) => (
                    <EmployeeCard
                        employee={employee}
                        key={employee.id}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </div>
    );
}

function TableHeader({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    return (
        <th
            className={cn(
                'px-4 py-3 text-center text-xs font-medium tracking-normal uppercase',
                className,
            )}
            scope="col"
        >
            {children}
        </th>
    );
}

function EmployeeRow({
    direction,
    employee,
    onDelete,
    onEdit,
}: {
    direction: 'ltr' | 'rtl';
    employee: Employee;
    onDelete: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
}) {
    const { t } = useI18n();

    return (
        <tr className="border-b last:border-b-0">
            <td className="px-4 py-4 font-medium">{employee.name}</td>
            <td className="px-4 py-4 text-muted-foreground">
                {formatDate(employee.contractStartDate, direction)} -{' '}
                {formatDate(employee.contractEndDate, direction)}
            </td>
            <td className="px-4 py-4 text-muted-foreground">
                {formatOptionalRange(
                    employee.iqamaStartDate,
                    employee.iqamaEndDate,
                    direction,
                    t('noIqamaDate'),
                )}
            </td>
            <td className="px-4 py-4">
                <ContractStatusBadge employee={employee} />
            </td>
            <td className="px-4 py-4 text-center">
                <div className="flex justify-center gap-2">
                    <IconButton
                        label={t('edit')}
                        onClick={() => {
                            onEdit(employee);
                        }}
                    >
                        <Pencil className="size-4" />
                    </IconButton>
                    <IconButton
                        label={t('deleteEmployee')}
                        onClick={() => {
                            onDelete(employee);
                        }}
                    >
                        <Trash2 className="size-4" />
                    </IconButton>
                </div>
            </td>
        </tr>
    );
}

function EmployeeCard({
    employee,
    onDelete,
    onEdit,
}: {
    employee: Employee;
    onDelete: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
}) {
    const { direction, t } = useI18n();

    return (
        <article className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="font-medium">{employee.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(employee.contractEndDate, direction)}
                    </p>
                </div>
                <ContractStatusBadge employee={employee} />
            </div>
            <dl className="grid gap-3 text-sm">
                <div>
                    <dt className="text-muted-foreground">
                        {t('tableContract')}
                    </dt>
                    <dd>
                        {formatDate(employee.contractStartDate, direction)} -{' '}
                        {formatDate(employee.contractEndDate, direction)}
                    </dd>
                </div>
                <div>
                    <dt className="text-muted-foreground">{t('tableIqama')}</dt>
                    <dd>
                        {formatOptionalRange(
                            employee.iqamaStartDate,
                            employee.iqamaEndDate,
                            direction,
                            t('noIqamaDate'),
                        )}
                    </dd>
                </div>
            </dl>
            <div className="flex gap-2">
                <Button
                    onClick={() => {
                        onEdit(employee);
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                >
                    <Pencil className="size-4" />
                    {t('edit')}
                </Button>
                <Button
                    onClick={() => {
                        onDelete(employee);
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                >
                    <Trash2 className="size-4" />
                    {t('deleteEmployee')}
                </Button>
            </div>
        </article>
    );
}

function ContractStatusBadge({ employee }: { employee: Employee }) {
    const { t } = useI18n();
    const status = contractStatusForDate(employee.contractEndDate);
    const daysLeft = contractDaysLeft(employee.contractEndDate);

    return (
        <Badge className={statusClasses[status]} variant="outline">
            {formatDaysLeft(daysLeft, t)}
        </Badge>
    );
}

function formatDaysLeft(
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

function EmployeeFormDialog({
    employee,
    onOpenChange,
    onSubmit,
    open,
}: EmployeeFormDialogProps) {
    const { t } = useI18n();
    const [values, setValues] = useState<EmployeeFormValues>(
        employee ? employeeToFormValues(employee) : emptyEmployeeFormValues,
    );
    const [errors, setErrors] = useState<EmployeeFormErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    async function submitForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = validateEmployeeForm(values);

        if (!result.valid) {
            setErrors(result.errors);

            return;
        }

        setIsSaving(true);
        setFormError(null);

        try {
            await onSubmit(result.values);
            onOpenChange(false);
        } catch {
            setFormError(t('saveEmployeeError'));
        } finally {
            setIsSaving(false);
        }
    }

    function updateValue(field: keyof EmployeeFormValues, value: string) {
        setValues((current) => ({
            ...current,
            [field]: value,
        }));
        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    }

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent closeLabel={t('closeDialog')}>
                <DialogHeader>
                    <DialogTitle>
                        {employee ? t('editEmployee') : t('addEmployee')}
                    </DialogTitle>
                    <DialogDescription>{t('formHelp')}</DialogDescription>
                </DialogHeader>

                <form className="space-y-5" onSubmit={submitForm}>
                    {formError && (
                        <Alert variant="destructive">
                            <AlertCircle className="size-4" />
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}

                    <Field
                        error={translationForError(errors.name, t)}
                        id="employee-name"
                        label={t('employeeName')}
                    >
                        <Input
                            aria-invalid={Boolean(errors.name)}
                            id="employee-name"
                            onChange={(event) => {
                                updateValue('name', event.target.value);
                            }}
                            value={values.name}
                        />
                    </Field>

                    <fieldset className="grid gap-3 sm:grid-cols-2">
                        <legend className="mb-2 text-sm font-medium">
                            {t('contractDates')}
                        </legend>
                        <DateField
                            error={translationForError(
                                errors.contractStartDate,
                                t,
                            )}
                            label={t('contractStartDate')}
                            onChange={(value) => {
                                updateValue('contractStartDate', value);
                            }}
                            value={values.contractStartDate}
                            id="contract-start-date"
                        />
                        <DateField
                            error={translationForError(
                                errors.contractEndDate,
                                t,
                            )}
                            label={t('contractEndDate')}
                            onChange={(value) => {
                                updateValue('contractEndDate', value);
                            }}
                            value={values.contractEndDate}
                            id="contract-end-date"
                        />
                    </fieldset>

                    <fieldset className="grid gap-3 sm:grid-cols-2">
                        <legend className="mb-2 text-sm font-medium">
                            {t('iqamaDates')}{' '}
                            <span className="font-normal text-muted-foreground">
                                {t('iqamaOptional')}
                            </span>
                        </legend>
                        <DateField
                            error={translationForError(
                                errors.iqamaStartDate,
                                t,
                            )}
                            label={t('iqamaStartDate')}
                            onChange={(value) => {
                                updateValue('iqamaStartDate', value);
                            }}
                            value={values.iqamaStartDate}
                            id="iqama-start-date"
                        />
                        <DateField
                            error={translationForError(errors.iqamaEndDate, t)}
                            label={t('iqamaEndDate')}
                            onChange={(value) => {
                                updateValue('iqamaEndDate', value);
                            }}
                            value={values.iqamaEndDate}
                            id="iqama-end-date"
                        />
                    </fieldset>

                    <DialogFooter>
                        <Button
                            onClick={() => {
                                onOpenChange(false);
                            }}
                            type="button"
                            variant="outline"
                        >
                            {t('cancel')}
                        </Button>
                        <Button disabled={isSaving} type="submit">
                            {isSaving
                                ? t('saving')
                                : employee
                                  ? t('updateEmployee')
                                  : t('save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteEmployeeDialog({
    employee,
    isDeleting,
    onConfirm,
    onOpenChange,
}: {
    employee: Employee | null;
    isDeleting: boolean;
    onConfirm: () => void;
    onOpenChange: (open: boolean) => void;
}) {
    const { t } = useI18n();

    return (
        <Dialog onOpenChange={onOpenChange} open={Boolean(employee)}>
            <DialogContent closeLabel={t('closeDialog')}>
                <DialogHeader>
                    <DialogTitle>
                        {t('deleteEmployeeConfirmationTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('deleteEmployeeConfirmationDescription', {
                            employee: employee?.name ?? '',
                        })}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        disabled={isDeleting}
                        onClick={() => {
                            onOpenChange(false);
                        }}
                        type="button"
                        variant="outline"
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        disabled={isDeleting}
                        onClick={onConfirm}
                        type="button"
                        variant="destructive"
                    >
                        {isDeleting ? t('saving') : t('confirmDelete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DateField({
    error,
    id,
    label,
    onChange,
    value,
}: {
    error?: string;
    id: string;
    label: string;
    onChange: (value: string) => void;
    value: string;
}) {
    return (
        <Field error={error} id={id} label={label}>
            <Input
                aria-invalid={Boolean(error)}
                id={id}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                type="date"
                value={value}
            />
        </Field>
    );
}

function Field({
    children,
    error,
    id,
    label,
}: {
    children: ReactNode;
    error?: string;
    id: string;
    label: string;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function IconButton({
    children,
    label,
    onClick,
}: {
    children: ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <Button
            aria-label={label}
            onClick={onClick}
            size="icon"
            title={label}
            type="button"
            variant="ghost"
        >
            {children}
        </Button>
    );
}

function translationForError(
    error: EmployeeValidationErrorKey | undefined,
    t: (key: TranslationKey) => string,
): string | undefined {
    return error ? t(error) : undefined;
}

function formatDate(value: string, direction: 'ltr' | 'rtl'): string {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);

    return new Intl.DateTimeFormat(direction === 'rtl' ? 'ar-EG' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function formatOptionalRange(
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
