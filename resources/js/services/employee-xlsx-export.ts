import ExcelJS from 'exceljs';

import type { Language, TranslationKey } from '@/i18n';
import type {
    EmployeeExportColumnKey,
    EmployeeTableRow,
} from '@/services/employee-table';
import { buildEmployeeExportMatrix } from '@/services/employee-table';

type EmployeeXlsxExportOptions = {
    columns: EmployeeExportColumnKey[];
    direction: 'ltr' | 'rtl';
    language: Language;
    notSetLabel: string;
    rows: EmployeeTableRow[];
    t: (
        key: TranslationKey,
        replacements?: Partial<Record<'count', string | number>>,
    ) => string;
};

const xlsxContentType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function exportEmployeeRowsToXlsx({
    columns,
    direction,
    language,
    notSetLabel,
    rows,
    t,
}: EmployeeXlsxExportOptions): Promise<void> {
    const matrix = buildEmployeeExportMatrix(rows, columns, {
        direction,
        notSetLabel,
        t,
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
        language === 'ar'
            ? '\u0627\u0644\u0645\u0648\u0638\u0641\u0648\u0646'
            : 'Employees',
        {
            views: [
                {
                    rightToLeft: direction === 'rtl',
                    state: 'frozen',
                    ySplit: 1,
                },
            ],
        },
    );

    workbook.creator = 'Contract Tracker';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.properties.date1904 = false;

    worksheet.addRows(matrix);
    worksheet.autoFilter = {
        from: { column: 1, row: 1 },
        to: { column: Math.max(columns.length, 1), row: 1 },
    };

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.alignment = {
                horizontal: direction === 'rtl' ? 'right' : 'left',
                vertical: 'middle',
                wrapText: true,
            };
            cell.border = {
                bottom: { color: { argb: 'FFE5E7EB' }, style: 'thin' },
                left: { color: { argb: 'FFE5E7EB' }, style: 'thin' },
                right: { color: { argb: 'FFE5E7EB' }, style: 'thin' },
                top: { color: { argb: 'FFE5E7EB' }, style: 'thin' },
            };

            if (rowNumber === 1) {
                cell.fill = {
                    fgColor: { argb: 'FF111827' },
                    pattern: 'solid',
                    type: 'pattern',
                };
                cell.font = {
                    bold: true,
                    color: { argb: 'FFFFFFFF' },
                };
            }
        });
    });

    worksheet.columns.forEach((column, index) => {
        const columnValues = matrix.map((row) => row[index] ?? '');
        const maxTextLength = Math.max(
            ...columnValues.map((value) => value.length),
            12,
        );

        column.width = Math.min(Math.max(maxTextLength + 4, 16), 38);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: xlsxContentType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = buildExportFileName(language);
    link.click();
    URL.revokeObjectURL(url);
}

function buildExportFileName(language: Language): string {
    const date = new Date().toISOString().slice(0, 10);

    return language === 'ar'
        ? `\u062a\u0635\u062f\u064a\u0631-\u0627\u0644\u0645\u0648\u0638\u0641\u064a\u0646-${date}.xlsx`
        : `employee-export-${date}.xlsx`;
}
