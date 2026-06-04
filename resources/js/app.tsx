import {
    BriefcaseBusiness,
    LayoutDashboard,
    Settings,
    Settings2,
} from 'lucide-react';
import { StrictMode, useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppTitlebar } from '@/components/app-titlebar';
import { EmployeeDashboard } from '@/components/employee-dashboard';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppStartup } from '@/hooks/use-app-startup';
import { useAppUpdates } from '@/hooks/use-app-updates';
import type { AppUpdateState } from '@/hooks/use-app-updates';
import { initializeTheme } from '@/hooks/use-appearance';
import { I18nProvider, useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { cn } from '@/lib/utils';
import { isNativeRuntime } from '@/services/app-window';

const appName = import.meta.env.VITE_APP_NAME || 'Contract Tracker';
type AppView = 'dashboard' | 'settings';

function App() {
    const updates = useAppUpdates({ checkOnStartup: true });
    const nativeRuntime = isNativeRuntime();
    const currentView = useCurrentView();

    return (
        <I18nProvider>
            <AppTitle currentView={currentView} />
            <TooltipProvider delayDuration={0}>
                <div
                    className={
                        nativeRuntime
                            ? 'min-h-screen bg-background pt-10'
                            : 'min-h-screen bg-background'
                    }
                >
                    {nativeRuntime && <AppTitlebar />}
                    <AppShell
                        currentView={currentView}
                        nativeChrome={nativeRuntime}
                        version={updates.version?.version ?? null}
                    >
                        {currentView === 'settings' ? (
                            <SettingsView />
                        ) : (
                            <EmployeeDashboard nativeChrome={nativeRuntime} />
                        )}
                    </AppShell>
                    <AppUpdatePrompt updates={updates} />
                </div>
            </TooltipProvider>
            <Toaster />
        </I18nProvider>
    );
}

function useCurrentView(): AppView {
    const [path, setPath] = useState(() => window.location.pathname);

    useEffect(() => {
        function syncPath() {
            setPath(window.location.pathname);
        }

        window.addEventListener('popstate', syncPath);

        return () => {
            window.removeEventListener('popstate', syncPath);
        };
    }, []);

    if (path.startsWith('/settings')) {
        return 'settings';
    }

    return 'dashboard';
}

function navigateTo(path: string) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
}

function AppShell({
    children,
    currentView,
    nativeChrome,
    version,
}: {
    children: ReactNode;
    currentView: AppView;
    nativeChrome: boolean;
    version: string | null;
}) {
    const { t } = useI18n();

    return (
        <div
            className={cn(
                'flex bg-background text-foreground',
                nativeChrome ? 'min-h-[calc(100vh-2.5rem)]' : 'min-h-screen',
            )}
        >
            <aside
                className="app-drag-region flex w-56 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground"
                dir="ltr"
            >
                <div className="flex h-16 items-center gap-3 border-b px-4">
                    <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                        <BriefcaseBusiness className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                            {appName}
                        </div>
                    </div>
                </div>
                <nav className="app-no-drag flex flex-1 flex-col gap-1 px-3 py-4">
                    <NavItem
                        active={currentView === 'dashboard'}
                        href="/dashboard"
                        icon={<LayoutDashboard className="size-4" />}
                        label={t('navDashboard')}
                    />
                    <NavItem
                        active={currentView === 'settings'}
                        href="/settings"
                        icon={<Settings className="size-4" />}
                        label={t('navSettings')}
                    />
                </nav>
                <footer className="border-t px-4 py-3 text-xs text-muted-foreground">
                    {version
                        ? t('appVersion', { version })
                        : t('appVersionLoading')}
                </footer>
            </aside>
            <div className="min-w-0 flex-1 overflow-auto">{children}</div>
        </div>
    );
}

function NavItem({
    active,
    href,
    icon,
    label,
}: {
    active: boolean;
    href: string;
    icon: ReactNode;
    label: string;
}) {
    function openView(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        navigateTo(href);
    }

    return (
        <a
            aria-current={active ? 'page' : undefined}
            className={cn(
                'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
            href={href}
            onClick={openView}
        >
            {icon}
            <span>{label}</span>
        </a>
    );
}

function SettingsView() {
    const startup = useAppStartup();
    const { t } = useI18n();
    const disabled =
        startup.isLoading ||
        startup.isSaving ||
        startup.preference.status === 'unavailable';

    return (
        <main className="min-h-full bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <header className="border-b pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-md border bg-muted">
                            <Settings2 className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-normal">
                                {t('settingsTitle')}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('settingsSubtitle')}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="rounded-md border bg-card p-5 text-card-foreground">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-medium">
                                {t('startWithWindows')}
                            </h2>
                            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                                {startup.preference.status === 'unavailable'
                                    ? t('startWithWindowsUnavailable')
                                    : t('startWithWindowsDescription')}
                            </p>
                        </div>
                        <button
                            aria-checked={startup.preference.enabled}
                            className={cn(
                                'relative h-7 w-12 rounded-full border transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
                                startup.preference.enabled
                                    ? 'border-primary bg-primary'
                                    : 'border-input bg-muted',
                            )}
                            disabled={disabled}
                            onClick={() => {
                                void startup.setEnabled(
                                    !startup.preference.enabled,
                                );
                            }}
                            role="switch"
                            type="button"
                        >
                            <span
                                className={cn(
                                    'absolute top-0.75 size-5 rounded-full bg-background shadow-sm transition-transform',
                                    startup.preference.enabled
                                        ? 'translate-x-5.5'
                                        : 'translate-x-0.75',
                                )}
                            />
                        </button>
                    </div>
                </section>
            </section>
        </main>
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

function AppTitle({ currentView }: { currentView: AppView }) {
    const { t } = useI18n();
    const titleKey: TranslationKey =
        currentView === 'settings' ? 'settingsTitle' : 'dashboardTitle';

    useEffect(() => {
        document.title = `${t(titleKey)} - ${appName}`;
    }, [t, titleKey]);

    return null;
}

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

initializeTheme();
