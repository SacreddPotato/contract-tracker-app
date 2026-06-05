import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'ar';

const languageStorageKey = 'contract-tracker-language';

const translations = {
    en: {
        addEmployee: 'Add employee',
        anonymousAuthUnavailable:
            'Supabase is configured, but anonymous sign-in is unavailable. Enable Anonymous Sign-Ins in Supabase Auth, then reload the app.',
        appVersion: 'Version {version}',
        appVersionLoading: 'Loading version',
        authLoading: 'Preparing your workspace',
        authStateUnavailable:
            'Supabase authentication is temporarily unavailable. Reload the app or check the Supabase project settings.',
        cancel: 'Cancel',
        closeDialog: 'Close',
        confirmDelete: 'Delete',
        contractDates: 'Contract dates',
        contractDaysExpired: '{count} days overdue',
        contractDaysLeft: '{count} days left',
        contractEndsToday: 'Ends today',
        contractEndDate: 'Contract end date',
        contractEndDateInvalid: 'Use a valid contract end date.',
        contractEndDateRequired: 'Contract end date is required.',
        contractStartDate: 'Contract start date',
        contractStartDateInvalid: 'Use a valid contract start date.',
        contractStartDateRequired: 'Contract start date is required.',
        dashboardSubtitle:
            'Track contract and iqama dates for the current workspace.',
        dashboardTitle: 'Employee contracts',
        deleteEmployee: 'Delete employee',
        deleteEmployeeConfirmationDescription:
            'This will permanently remove {employee} from this workspace.',
        deleteEmployeeConfirmationTitle: 'Delete employee?',
        deleteEmployeeDescription:
            'This removes the employee from this workspace.',
        edit: 'Edit',
        editEmployee: 'Edit employee',
        emptyDescription:
            'Add your first employee to start tracking contract deadlines.',
        emptyTitle: 'No employees yet',
        employeeName: 'Employee name',
        supabaseMissing:
            'Supabase is not configured. Add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to start tracking employees.',
        formHelp:
            'Required fields are name, contract start date, and contract end date.',
        iqamaDates: 'Iqama dates',
        iqamaEndDate: 'Iqama end date',
        iqamaEndDateInvalid: 'Use a valid iqama end date.',
        iqamaOptional: 'Optional',
        iqamaStartDate: 'Iqama start date',
        iqamaStartDateInvalid: 'Use a valid iqama start date.',
        language: 'Language',
        languageArabic: 'Arabic',
        languageEnglish: 'English',
        loadEmployeesError: 'Unable to load employees.',
        loadingEmployees: 'Loading employees',
        nameRequired: 'Name is required.',
        navDashboard: 'Dashboard',
        navSettings: 'Settings',
        noIqamaDate: 'Not set',
        retry: 'Retry',
        save: 'Save',
        saveEmployeeError: 'Unable to save the employee.',
        saving: 'Saving',
        settingsSubtitle: 'Manage desktop preferences for this app.',
        settingsTitle: 'Settings',
        startWithWindows: 'Start with Windows',
        startWithWindowsDescription:
            'Open Contract Tracker automatically when you sign in to Windows.',
        startWithWindowsUnavailable:
            'This setting is available in the packaged desktop app.',
        statusGreen: 'Healthy',
        statusRed: 'Urgent',
        statusYellow: 'Watch',
        tableActions: 'Actions',
        tableContract: 'Contract',
        tableEmployee: 'Employee',
        tableIqama: 'Iqama',
        tableStatus: 'Status',
        updateEmployee: 'Update employee',
        updateInstalling: 'Installing',
        updateReadyDescription:
            'Restart the app to install the downloaded update.',
        updateReadyTitle: 'Update ready',
        updateRestart: 'Restart and install',
        windowClose: 'Close window',
        windowMaximize: 'Maximize window',
        windowMinimize: 'Minimize window',
        windowRestore: 'Restore window',
    },
    ar: {
        addEmployee: 'إضافة موظف',
        anonymousAuthUnavailable:
            'تم إعداد Supabase، لكن تسجيل الدخول المجهول غير متاح. فعّل تسجيل الدخول المجهول في Supabase Auth ثم أعد تحميل التطبيق.',
        appVersion: 'الإصدار {version}',
        appVersionLoading: 'جار تحميل الإصدار',
        authLoading: 'جار تجهيز مساحة العمل',
        authStateUnavailable:
            'مصادقة Supabase غير متاحة مؤقتا. أعد تحميل التطبيق أو تحقق من إعدادات مشروع Supabase.',
        cancel: 'إلغاء',
        closeDialog: 'إغلاق',
        confirmDelete: 'حذف',
        contractDates: 'تواريخ العقد',
        contractDaysExpired: 'متأخر {count} يوم',
        contractDaysLeft: 'متبقي {count} يوم',
        contractEndsToday: 'ينتهي اليوم',
        contractEndDate: 'تاريخ نهاية العقد',
        contractEndDateInvalid: 'استخدم تاريخ نهاية عقد صحيحا.',
        contractEndDateRequired: 'تاريخ نهاية العقد مطلوب.',
        contractStartDate: 'تاريخ بداية العقد',
        contractStartDateInvalid: 'استخدم تاريخ بداية عقد صحيحا.',
        contractStartDateRequired: 'تاريخ بداية العقد مطلوب.',
        dashboardSubtitle: 'تابع تواريخ العقود والإقامات لمساحة العمل الحالية.',
        dashboardTitle: 'عقود الموظفين',
        deleteEmployee: 'حذف الموظف',
        deleteEmployeeConfirmationDescription:
            'سيتم حذف {employee} نهائيا من مساحة العمل هذه.',
        deleteEmployeeConfirmationTitle: 'حذف الموظف؟',
        deleteEmployeeDescription: 'سيتم حذف الموظف من مساحة العمل الحالية.',
        edit: 'تعديل',
        editEmployee: 'تعديل الموظف',
        emptyDescription: 'أضف أول موظف لبدء متابعة مواعيد العقود.',
        emptyTitle: 'لا يوجد موظفون بعد',
        employeeName: 'اسم الموظف',
        supabaseMissing:
            'لم يتم إعداد Supabase. أضف SUPABASE_URL و SUPABASE_PUBLISHABLE_KEY لبدء متابعة الموظفين.',
        formHelp:
            'الحقول المطلوبة هي الاسم وتاريخ بداية العقد وتاريخ نهاية العقد.',
        iqamaDates: 'تواريخ الإقامة',
        iqamaEndDate: 'تاريخ نهاية الإقامة',
        iqamaEndDateInvalid: 'استخدم تاريخ نهاية إقامة صحيحا.',
        iqamaOptional: 'اختياري',
        iqamaStartDate: 'تاريخ بداية الإقامة',
        iqamaStartDateInvalid: 'استخدم تاريخ بداية إقامة صحيحا.',
        language: 'اللغة',
        languageArabic: 'العربية',
        languageEnglish: 'English',
        loadEmployeesError: 'تعذر تحميل الموظفين.',
        loadingEmployees: 'جار تحميل الموظفين',
        nameRequired: 'الاسم مطلوب.',
        navDashboard: 'لوحة التحكم',
        navSettings: 'الإعدادات',
        noIqamaDate: 'غير محدد',
        retry: 'إعادة المحاولة',
        save: 'حفظ',
        saveEmployeeError: 'تعذر حفظ الموظف.',
        saving: 'جار الحفظ',
        settingsSubtitle: 'إدارة تفضيلات سطح المكتب لهذا التطبيق.',
        settingsTitle: 'الإعدادات',
        startWithWindows: 'بدء التشغيل مع Windows',
        startWithWindowsDescription:
            'افتح Contract Tracker تلقائيا عند تسجيل الدخول إلى Windows.',
        startWithWindowsUnavailable:
            'هذا الإعداد متاح في تطبيق سطح المكتب المثبت.',
        statusGreen: 'مطمئن',
        statusRed: 'عاجل',
        statusYellow: 'متابعة',
        tableActions: 'الإجراءات',
        tableContract: 'العقد',
        tableEmployee: 'الموظف',
        tableIqama: 'الإقامة',
        tableStatus: 'الحالة',
        updateEmployee: 'تحديث الموظف',
        updateInstalling: 'جار التثبيت',
        updateReadyDescription:
            'أعد تشغيل التطبيق لتثبيت التحديث الذي تم تنزيله.',
        updateReadyTitle: 'التحديث جاهز',
        updateRestart: 'إعادة التشغيل والتثبيت',
        windowClose: 'إغلاق النافذة',
        windowMaximize: 'تكبير النافذة',
        windowMinimize: 'تصغير النافذة',
        windowRestore: 'استعادة النافذة',
    },
} as const;

export type TranslationKey = keyof typeof translations.en;

type I18nContextValue = {
    direction: 'ltr' | 'rtl';
    language: Language;
    setLanguage: (language: Language) => void;
    t: (
        key: TranslationKey,
        replacements?: Partial<
            Record<'count' | 'employee' | 'version', string | number>
        >,
    ) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window === 'undefined') {
            return 'en';
        }

        return window.localStorage.getItem(languageStorageKey) === 'ar'
            ? 'ar'
            : 'en';
    });

    const setLanguage = useCallback((nextLanguage: Language) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem(languageStorageKey, nextLanguage);
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const value = useMemo<I18nContextValue>(
        () => ({
            direction: language === 'ar' ? 'rtl' : 'ltr',
            language,
            setLanguage,
            t: (key, replacements = {}) => {
                let message: string = translations[language][key];

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
        [language, setLanguage],
    );

    return (
        <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
}

export function useI18n(): I18nContextValue {
    const value = useContext(I18nContext);

    if (!value) {
        throw new Error('useI18n must be used within I18nProvider.');
    }

    return value;
}
