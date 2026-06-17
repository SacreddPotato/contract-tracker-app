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
        appApiTokenMissing:
            'The app API token is not configured. Add APP_API_TOKEN to start tracking employees.',
        appNavigationTitle: 'August International Schools - Contract Tracker',
        appVersion: 'Version {version}',
        appVersionLoading: 'Loading version',
        authLoading: 'Preparing your workspace',
        authStateUnavailable:
            'App API access is temporarily unavailable. Reload the app or check the local app token setting.',
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
        deadlineFilter: 'Deadline filter',
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
        exportColumns: 'Export columns',
        exportTable: 'Export',
        exportXlsx: 'Download XLSX',
        employeeName: 'Employee name',
        employeeDetails: 'Employee details',
        employeeEmail: 'Email',
        employeeEmailInvalid: 'Use a valid email address.',
        formHelp:
            'Required fields are name, contract start date, and contract end date. Employee details are optional.',
        filterAllDeadlines: 'Show all',
        filterUnderDays: 'Show only under {count} days',
        filteredEmployeesEmptyDescription:
            'Adjust the search or deadline filters to see more employees.',
        filteredEmployeesEmptyTitle: 'No matching employees',
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
        loadNotificationsError: 'Unable to load notifications.',
        loadingEmployees: 'Loading employees',
        loadingNotifications: 'Loading notifications',
        markAllNotificationsRead: 'Mark all read',
        markNotificationRead: 'Mark read',
        nameRequired: 'Name is required.',
        navDashboard: 'Dashboard',
        navNotifications: 'Notifications',
        navSettings: 'Settings',
        nationality: 'Nationality',
        noIqamaDate: 'Not set',
        notSet: 'Not set',
        notificationCreatedAt: 'Created',
        notificationRead: 'Read',
        notificationsBell: 'Notifications',
        notificationsEmptyDescription:
            'Contract deadline notifications will appear here.',
        notificationsEmptyTitle: 'No notifications yet',
        notificationsSubtitle:
            'Review contract deadline alerts and mark them read.',
        notificationsTitle: 'Notifications',
        notificationUnread: 'Unread',
        phoneNumber: 'Phone number',
        retry: 'Retry',
        save: 'Save',
        saveEmployeeError: 'Unable to save the employee.',
        saving: 'Saving',
        searchEmployees: 'Search employees',
        searchEmployeesPlaceholder: 'Search by employee name',
        settingsSubtitle: 'Manage desktop preferences for this app.',
        settingsTitle: 'Settings',
        startWithWindows: 'Start with Windows',
        startWithWindowsDescription:
            'Open Contract Tracker automatically when you sign in to Windows.',
        startWithWindowsUnavailable:
            'This setting is available in the packaged desktop app.',
        statusGreen: 'Healthy',
        statusOrange: 'Soon',
        statusRed: 'Urgent',
        statusYellow: 'Watch',
        contractNotificationMessage:
            '{employee} has a contract ending within {count} days.',
        sortAscending: 'Sort ascending',
        sortDescending: 'Sort descending',
        tableActions: 'Actions',
        tableContract: 'Contract',
        tableEmployee: 'Employee',
        tableIqama: 'Iqama',
        tableStatus: 'Status',
        tableTimeUntilContractEnd: 'Time until contract end',
        tableTimeUntilIqamaEnd: 'Time until iqama end',
        updateEmployee: 'Update employee',
        updateInstalling: 'Installing',
        updateReadyDescription:
            'Restart the app to install the downloaded update.',
        updateReadyTitle: 'Update ready',
        updateRestart: 'Restart and install',
        viewEmployee: 'View employee',
        windowClose: 'Close window',
        windowMaximize: 'Maximize window',
        windowMinimize: 'Minimize window',
        windowRestore: 'Restore window',
    },
    ar: {
        appApiTokenMissing:
            'APP_API_TOKEN is not configured. Add it to start tracking employees.',
        deadlineFilter: 'تصفية الموعد',
        exportColumns: 'أعمدة التصدير',
        exportTable: 'تصدير',
        exportXlsx: 'تنزيل XLSX',
        filterAllDeadlines: 'عرض الكل',
        filterUnderDays: 'عرض أقل من {count} يوم فقط',
        filteredEmployeesEmptyDescription:
            'عدّل البحث أو تصفيات المواعيد لعرض مزيد من الموظفين.',
        filteredEmployeesEmptyTitle: 'لا توجد نتائج مطابقة',
        searchEmployees: 'بحث الموظفين',
        searchEmployeesPlaceholder: 'ابحث باسم الموظف',
        sortAscending: 'ترتيب تصاعدي',
        sortDescending: 'ترتيب تنازلي',
        tableTimeUntilContractEnd: 'المدة حتى نهاية العقد',
        tableTimeUntilIqamaEnd: 'المدة حتى نهاية الإقامة',
        addEmployee: 'إضافة موظف',
        appNavigationTitle: 'مدارس أغسطس الدولية - متتبع العقود',
        appVersion: 'الإصدار {version}',
        appVersionLoading: 'جار تحميل الإصدار',
        authLoading: 'جار تجهيز مساحة العمل',
        authStateUnavailable:
            'App API access is temporarily unavailable. Reload the app or check the local app token setting.',
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
        employeeDetails: 'بيانات الموظف',
        employeeEmail: 'البريد الإلكتروني',
        employeeEmailInvalid: 'استخدم بريدا إلكترونيا صحيحا.',
        formHelp:
            'الحقول المطلوبة هي الاسم وتاريخ بداية العقد وتاريخ نهاية العقد. بيانات الموظف اختيارية.',
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
        loadNotificationsError: 'تعذر تحميل الإشعارات.',
        loadingEmployees: 'جار تحميل الموظفين',
        loadingNotifications: 'جار تحميل الإشعارات',
        markAllNotificationsRead: 'تحديد الكل كمقروء',
        markNotificationRead: 'تحديد كمقروء',
        nameRequired: 'الاسم مطلوب.',
        navDashboard: 'لوحة التحكم',
        navNotifications: 'الإشعارات',
        navSettings: 'الإعدادات',
        nationality: 'الجنسية',
        noIqamaDate: 'غير محدد',
        notSet: 'غير محدد',
        notificationCreatedAt: 'تاريخ الإنشاء',
        notificationRead: 'مقروء',
        notificationsBell: 'الإشعارات',
        notificationsEmptyDescription: 'ستظهر إشعارات مواعيد العقود هنا.',
        notificationsEmptyTitle: 'لا توجد إشعارات بعد',
        notificationsSubtitle: 'راجع تنبيهات مواعيد العقود وحددها كمقروءة.',
        notificationsTitle: 'الإشعارات',
        notificationUnread: 'غير مقروء',
        phoneNumber: 'رقم الهاتف',
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
        statusOrange: 'قريب',
        statusRed: 'عاجل',
        statusYellow: 'متابعة',
        contractNotificationMessage: 'ينتهي عقد {employee} خلال {count} يوم.',
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
        viewEmployee: 'عرض الموظف',
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
