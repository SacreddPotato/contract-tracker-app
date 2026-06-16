import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Download,
    Eye,
    Filter,
    Languages,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useEmployees } from '@/hooks/use-employees';
import type { SupabaseAnonymousUserState } from '@/hooks/use-supabase-anonymous-user';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { cn } from '@/lib/utils';
import type {
    ContractStatus,
    Employee,
    EmployeeFormErrors,
    EmployeeFormValues,
    EmployeeValidationErrorKey,
} from '@/services/employee-records';
import {
    employeeToFormValues,
    emptyEmployeeFormValues,
    validateEmployeeForm,
} from '@/services/employee-records';
import type {
    EmployeeDeadlineFilter,
    EmployeeExportColumnKey,
    EmployeeSortColumn,
    EmployeeSortState,
    EmployeeTableRow,
} from '@/services/employee-table';
import {
    buildEmployeeTableRows,
    employeeExportColumnKeys,
    employeeExportColumnLabelKeys,
    formatDate,
    formatDaysLeft,
    formatOptionalRange,
    getNextEmployeeSort,
} from '@/services/employee-table';
import { exportEmployeeRowsToXlsx } from '@/services/employee-xlsx-export';

type EmployeeFormDialogProps = {
    employee: Employee | null;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: EmployeeFormValues) => Promise<void>;
    open: boolean;
};

const statusClasses: Record<ContractStatus, string> = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300',
    red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
    yellow: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
};

const deadlineFilterOptions: EmployeeDeadlineFilter[] = [30, 60, 90];

export function EmployeeDashboard({
    auth,
    nativeChrome = false,
}: {
    auth: SupabaseAnonymousUserState;
    nativeChrome?: boolean;
}) {
    const { direction, language, setLanguage, t } = useI18n();
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
                'min-w-fit bg-background text-foreground',
                nativeChrome ? 'min-h-[calc(100vh-2.5rem)]' : 'min-h-screen',
            )}
        >
            <section
                className={cn(
                    'mx-auto flex w-max min-w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8',
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
    const { language, t } = useI18n();
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState<EmployeeSortState | null>(null);
    const [contractDeadlineFilter, setContractDeadlineFilter] =
        useState<EmployeeDeadlineFilter | null>(null);
    const [iqamaDeadlineFilter, setIqamaDeadlineFilter] =
        useState<EmployeeDeadlineFilter | null>(null);
    const [selectedExportColumns, setSelectedExportColumns] = useState<
        EmployeeExportColumnKey[]
    >([...employeeExportColumnKeys]);
    const [isExporting, setIsExporting] = useState(false);
    const rows = useMemo(
        () =>
            buildEmployeeTableRows(employees, {
                contractDeadlineFilter,
                iqamaDeadlineFilter,
                searchQuery,
                sort,
            }),
        [
            contractDeadlineFilter,
            employees,
            iqamaDeadlineFilter,
            searchQuery,
            sort,
        ],
    );

    function sortBy(column: EmployeeSortColumn) {
        setSort((currentSort) => getNextEmployeeSort(currentSort, column));
    }

    function toggleExportColumn(column: EmployeeExportColumnKey) {
        setSelectedExportColumns((currentColumns) =>
            currentColumns.includes(column)
                ? currentColumns.filter(
                      (currentColumn) => currentColumn !== column,
                  )
                : employeeExportColumnKeys.filter(
                      (currentColumn) =>
                          currentColumns.includes(currentColumn) ||
                          currentColumn === column,
                  ),
        );
    }

    async function exportRows() {
        if (selectedExportColumns.length === 0) {
            return;
        }

        setIsExporting(true);

        try {
            await exportEmployeeRowsToXlsx({
                columns: selectedExportColumns,
                direction,
                language,
                notSetLabel: t('notSet'),
                rows,
                t,
            });
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        aria-label={t('searchEmployees')}
                        className="ps-9"
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                        }}
                        placeholder={t('searchEmployeesPlaceholder')}
                        value={searchQuery}
                    />
                </div>
                <ExportMenu
                    disabled={selectedExportColumns.length === 0}
                    isExporting={isExporting}
                    onExport={() => {
                        void exportRows();
                    }}
                    onToggleColumn={toggleExportColumn}
                    selectedColumns={selectedExportColumns}
                />
            </div>

            {rows.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed px-6 text-center">
                    <h2 className="text-lg font-medium">
                        {t('filteredEmployeesEmptyTitle')}
                    </h2>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        {t('filteredEmployeesEmptyDescription')}
                    </p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <div className="hidden md:block">
                        <table className="w-full min-w-275 text-center text-sm">
                            <thead className="border-b bg-muted/60 text-muted-foreground">
                                <tr className="text-center">
                                    <SortableTableHeader
                                        column="name"
                                        label={t('tableEmployee')}
                                        onSort={sortBy}
                                        sort={sort}
                                    />
                                    <SortableTableHeader
                                        column="contractRange"
                                        label={t('tableContract')}
                                        onSort={sortBy}
                                        sort={sort}
                                    />
                                    <SortableTableHeader
                                        column="iqamaRange"
                                        label={t('tableIqama')}
                                        onSort={sortBy}
                                        sort={sort}
                                    />
                                    <DeadlineTableHeader
                                        column="contractTimeLeft"
                                        filter={contractDeadlineFilter}
                                        label={t('tableTimeUntilContractEnd')}
                                        onFilterChange={
                                            setContractDeadlineFilter
                                        }
                                        onSort={sortBy}
                                        sort={sort}
                                    />
                                    <DeadlineTableHeader
                                        column="iqamaTimeLeft"
                                        filter={iqamaDeadlineFilter}
                                        label={t('tableTimeUntilIqamaEnd')}
                                        onFilterChange={setIqamaDeadlineFilter}
                                        onSort={sortBy}
                                        sort={sort}
                                    />
                                    <TableHeader className="text-center">
                                        {t('tableActions')}
                                    </TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <EmployeeRow
                                        direction={direction}
                                        key={row.employee.id}
                                        onDelete={onDelete}
                                        onEdit={onEdit}
                                        row={row}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="divide-y md:hidden">
                        {rows.map((row) => (
                            <EmployeeCard
                                key={row.employee.id}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                row={row}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ExportMenu({
    disabled,
    isExporting,
    onExport,
    onToggleColumn,
    selectedColumns,
}: {
    disabled: boolean;
    isExporting: boolean;
    onExport: () => void;
    onToggleColumn: (column: EmployeeExportColumnKey) => void;
    selectedColumns: EmployeeExportColumnKey[];
}) {
    const { t } = useI18n();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline">
                    <Download className="size-4" />
                    {t('exportTable')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{t('exportColumns')}</DropdownMenuLabel>
                {employeeExportColumnKeys.map((column) => (
                    <DropdownMenuCheckboxItem
                        checked={selectedColumns.includes(column)}
                        key={column}
                        onCheckedChange={() => {
                            onToggleColumn(column);
                        }}
                    >
                        {t(employeeExportColumnLabelKeys[column])}
                    </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={disabled || isExporting}
                    onSelect={onExport}
                >
                    <Download className="size-4" />
                    {t('exportXlsx')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function SortableTableHeader({
    className,
    column,
    label,
    onSort,
    sort,
}: {
    className?: string;
    column: EmployeeSortColumn;
    label: string;
    onSort: (column: EmployeeSortColumn) => void;
    sort: EmployeeSortState | null;
}) {
    return (
        <TableHeader className={className}>
            <SortButton
                column={column}
                label={label}
                onSort={onSort}
                sort={sort}
            />
        </TableHeader>
    );
}

function DeadlineTableHeader({
    column,
    filter,
    label,
    onFilterChange,
    onSort,
    sort,
}: {
    column: EmployeeSortColumn;
    filter: EmployeeDeadlineFilter | null;
    label: string;
    onFilterChange: (filter: EmployeeDeadlineFilter | null) => void;
    onSort: (column: EmployeeSortColumn) => void;
    sort: EmployeeSortState | null;
}) {
    const { t } = useI18n();

    return (
        <TableHeader>
            <div className="flex items-center justify-center gap-1">
                <SortButton
                    column={column}
                    label={label}
                    onSort={onSort}
                    sort={sort}
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            aria-label={`${label}: ${t('deadlineFilter')}`}
                            className={cn(
                                'size-8',
                                filter !== null &&
                                    'bg-accent text-accent-foreground',
                            )}
                            size="icon"
                            title={t('deadlineFilter')}
                            type="button"
                            variant="ghost"
                        >
                            <Filter className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                            checked={filter === null}
                            onCheckedChange={() => {
                                onFilterChange(null);
                            }}
                        >
                            {t('filterAllDeadlines')}
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        {deadlineFilterOptions.map((option) => (
                            <DropdownMenuCheckboxItem
                                checked={filter === option}
                                key={option}
                                onCheckedChange={() => {
                                    onFilterChange(option);
                                }}
                            >
                                {t('filterUnderDays', { count: option })}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </TableHeader>
    );
}

function TableHeader({
    children,
    className,
}: {
    children: ReactNode;
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

function SortButton({
    column,
    label,
    onSort,
    sort,
}: {
    column: EmployeeSortColumn;
    label: string;
    onSort: (column: EmployeeSortColumn) => void;
    sort: EmployeeSortState | null;
}) {
    const { t } = useI18n();
    const isActive = sort?.column === column;
    const sortLabel = isActive
        ? sort.direction === 'asc'
            ? t('sortDescending')
            : t('sortAscending')
        : t('sortAscending');

    return (
        <Button
            aria-label={`${label}: ${sortLabel}`}
            className="h-auto px-2 py-1 text-center text-xs font-medium tracking-normal whitespace-normal text-muted-foreground uppercase hover:text-foreground"
            onClick={() => {
                onSort(column);
            }}
            type="button"
            variant="ghost"
        >
            <span>{label}</span>
            {isActive ? (
                sort.direction === 'asc' ? (
                    <ArrowUp className="size-3.5" />
                ) : (
                    <ArrowDown className="size-3.5" />
                )
            ) : (
                <ArrowUpDown className="size-3.5" />
            )}
        </Button>
    );
}

function EmployeeRow({
    direction,
    onDelete,
    onEdit,
    row,
}: {
    direction: 'ltr' | 'rtl';
    onDelete: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    row: EmployeeTableRow;
}) {
    const { t } = useI18n();
    const { employee } = row;

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
                <DeadlineBadge daysLeft={row.contractDaysLeft} />
            </td>
            <td className="px-4 py-4">
                <DeadlineBadge daysLeft={row.iqamaDaysLeft} />
            </td>
            <td className="px-4 py-4 text-center">
                <div className="flex justify-center gap-2">
                    <EmployeeDetailsMenu compact employee={employee} />
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
    onDelete,
    onEdit,
    row,
}: {
    onDelete: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    row: EmployeeTableRow;
}) {
    const { direction, t } = useI18n();
    const { employee } = row;

    return (
        <article className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="font-medium">{employee.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(employee.contractEndDate, direction)}
                    </p>
                </div>
                <DeadlineBadge daysLeft={row.contractDaysLeft} />
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
                <div>
                    <dt className="text-muted-foreground">
                        {t('tableTimeUntilContractEnd')}
                    </dt>
                    <dd>{formatDaysLeft(row.contractDaysLeft, t)}</dd>
                </div>
                <div>
                    <dt className="text-muted-foreground">
                        {t('tableTimeUntilIqamaEnd')}
                    </dt>
                    <dd>
                        {row.iqamaDaysLeft === null
                            ? t('notSet')
                            : formatDaysLeft(row.iqamaDaysLeft, t)}
                    </dd>
                </div>
            </dl>
            <div className="flex gap-2">
                <EmployeeDetailsMenu employee={employee} />
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

function EmployeeDetailsMenu({
    compact = false,
    employee,
}: {
    compact?: boolean;
    employee: Employee;
}) {
    const { direction, t } = useI18n();
    const fallback = t('notSet');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label={t('viewEmployee')}
                    size={compact ? 'icon' : 'sm'}
                    title={t('viewEmployee')}
                    type="button"
                    variant="outline"
                >
                    <Eye className="size-4" />
                    {!compact && t('viewEmployee')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-3 text-sm">
                <div className="font-medium">{employee.name}</div>
                <DropdownMenuSeparator />
                <dl className="grid gap-3">
                    <DetailRow
                        label={t('phoneNumber')}
                        value={employee.phoneNumber ?? fallback}
                    />
                    <DetailRow
                        label={t('nationality')}
                        value={employee.nationality ?? fallback}
                    />
                    <DetailRow
                        label={t('employeeEmail')}
                        value={employee.email ?? fallback}
                    />
                    <DetailRow
                        label={t('tableContract')}
                        value={`${formatDate(
                            employee.contractStartDate,
                            direction,
                        )} - ${formatDate(employee.contractEndDate, direction)}`}
                    />
                    <DetailRow
                        label={t('tableIqama')}
                        value={formatOptionalRange(
                            employee.iqamaStartDate,
                            employee.iqamaEndDate,
                            direction,
                            fallback,
                        )}
                    />
                </dl>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid gap-1">
            <dt className="text-xs font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="break-words text-popover-foreground">{value}</dd>
        </div>
    );
}

function DeadlineBadge({ daysLeft }: { daysLeft: number | null }) {
    const { t } = useI18n();

    if (daysLeft === null) {
        return <Badge variant="outline">{t('notSet')}</Badge>;
    }

    return (
        <Badge
            className={statusClasses[statusForDaysLeft(daysLeft)]}
            variant="outline"
        >
            {formatDaysLeft(daysLeft, t)}
        </Badge>
    );
}

function statusForDaysLeft(daysLeft: number): ContractStatus {
    if (daysLeft <= 30) {
        return 'red';
    }

    if (daysLeft <= 60) {
        return 'orange';
    }

    if (daysLeft <= 90) {
        return 'yellow';
    }

    return 'green';
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

                    <fieldset className="grid gap-3 sm:grid-cols-3">
                        <legend className="mb-2 text-sm font-medium">
                            {t('employeeDetails')}{' '}
                            <span className="font-normal text-muted-foreground">
                                {t('iqamaOptional')}
                            </span>
                        </legend>
                        <Field
                            error={translationForError(errors.phoneNumber, t)}
                            id="employee-phone-number"
                            label={t('phoneNumber')}
                        >
                            <Input
                                aria-invalid={Boolean(errors.phoneNumber)}
                                id="employee-phone-number"
                                onChange={(event) => {
                                    updateValue(
                                        'phoneNumber',
                                        event.target.value,
                                    );
                                }}
                                value={values.phoneNumber}
                            />
                        </Field>
                        <Field
                            error={translationForError(errors.nationality, t)}
                            id="employee-nationality"
                            label={t('nationality')}
                        >
                            <Input
                                aria-invalid={Boolean(errors.nationality)}
                                id="employee-nationality"
                                onChange={(event) => {
                                    updateValue(
                                        'nationality',
                                        event.target.value,
                                    );
                                }}
                                value={values.nationality}
                            />
                        </Field>
                        <Field
                            error={translationForError(errors.email, t)}
                            id="employee-email"
                            label={t('employeeEmail')}
                        >
                            <Input
                                aria-invalid={Boolean(errors.email)}
                                id="employee-email"
                                onChange={(event) => {
                                    updateValue('email', event.target.value);
                                }}
                                type="email"
                                value={values.email}
                            />
                        </Field>
                    </fieldset>

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
