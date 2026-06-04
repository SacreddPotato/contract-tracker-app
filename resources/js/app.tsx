import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { AppTitlebar } from '@/components/app-titlebar';
import { EmployeeDashboard } from '@/components/employee-dashboard';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppUpdates } from '@/hooks/use-app-updates';
import type { AppUpdateState } from '@/hooks/use-app-updates';
import { initializeTheme } from '@/hooks/use-appearance';
import { I18nProvider, useI18n } from '@/i18n';
import { isNativeRuntime } from '@/services/app-window';

const appName = import.meta.env.VITE_APP_NAME || 'Contract Tracker';

function App() {
    const updates = useAppUpdates({ checkOnStartup: true });
    const nativeRuntime = isNativeRuntime();

    return (
        <I18nProvider>
            <AppTitle />
            <TooltipProvider delayDuration={0}>
                <div
                    className={
                        nativeRuntime ? 'min-h-screen bg-background pt-10' : ''
                    }
                >
                    {nativeRuntime && <AppTitlebar />}
                    <EmployeeDashboard nativeChrome={nativeRuntime} />
                    <AppUpdatePrompt updates={updates} />
                </div>
            </TooltipProvider>
            <Toaster />
        </I18nProvider>
    );
}

function AppUpdatePrompt({ updates }: { updates: AppUpdateState }) {
    const { t } = useI18n();

    if (updates.status !== 'downloaded') {
        return null;
    }

    return (
        <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-md border bg-background p-4 shadow-lg sm:left-auto sm:w-120">
            <div>
                <h2 className="text-sm font-medium">{t('updateReadyTitle')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('updateReadyDescription')}
                </p>
            </div>
            <div className="flex justify-end">
                <Button
                    disabled={updates.isChecking}
                    onClick={() => {
                        void updates.installNow();
                    }}
                    type="button"
                >
                    {updates.isChecking
                        ? t('updateInstalling')
                        : t('updateRestart')}
                </Button>
            </div>
        </div>
    );
}

function AppTitle() {
    const { t } = useI18n();

    useEffect(() => {
        document.title = `${t('dashboardTitle')} - ${appName}`;
    }, [t]);

    return null;
}

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

initializeTheme();
