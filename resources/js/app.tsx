import {
    Bell,
    CheckCheck,
    Inbox,
    LayoutDashboard,
    RefreshCw,
    Settings,
    Settings2,
} from 'lucide-react';
import { StrictMode, useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppTitlebar } from '@/components/app-titlebar';
import { EmployeeDashboard } from '@/components/employee-dashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppStartup } from '@/hooks/use-app-startup';
import { useAppUpdates } from '@/hooks/use-app-updates';
import type { AppUpdateState } from '@/hooks/use-app-updates';
import { initializeTheme } from '@/hooks/use-appearance';
import { useNotifications } from '@/hooks/use-notifications';
import { useSupabaseAnonymousUser } from '@/hooks/use-supabase-anonymous-user';
import { I18nProvider, useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { cn } from '@/lib/utils';
import { isNativeRuntime } from '@/services/app-window';
import type { EmployeeNotification } from '@/services/notification-api';
import appLogoUrl from '../assets/logo.png';

const appName = import.meta.env.VITE_APP_NAME || 'Contract Tracker';
type AppView = 'dashboard' | 'notifications' | 'settings';

function App() {
    const updates = useAppUpdates({ checkOnStartup: true });
    const nativeRuntime = isNativeRuntime();
    const currentView = useCurrentView();
    const auth = useSupabaseAnonymousUser();
    const notifications = useNotifications(auth.session?.access_token ?? null);

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
                        notifications={notifications}
                        version={updates.version?.version ?? null}
                    >
                        {currentView === 'settings' ? (
                            <SettingsView />
                        ) : currentView === 'notifications' ? (
                            <NotificationsView notifications={notifications} />
                        ) : (
                            <EmployeeDashboard
                                auth={auth}
                                nativeChrome={nativeRuntime}
                            />
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

    if (path.startsWith('/notifications')) {
        return 'notifications';
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
    notifications,
    version,
}: {
    children: ReactNode;
    currentView: AppView;
    nativeChrome: boolean;
    notifications: NotificationsState;
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
                className="app-drag-region flex w-72 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground"
                dir="ltr"
            >
                <div className="flex h-16 items-center gap-3 border-b px-4">
                    <img
                        alt=""
                        className="size-10 shrink-0 object-contain"
                        src={appLogoUrl}
                    />
                    <div className="min-w-0">
                        <div className="text-sm leading-tight font-semibold">
                            {t('appNavigationTitle')}
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
                    <NavItem
                        active={currentView === 'notifications'}
                        badge={notifications.unreadCount}
                        href="/notifications"
                        icon={<Inbox className="size-4" />}
                        label={t('navNotifications')}
                    />
                </nav>
                <footer className="border-t px-4 py-3 text-xs text-muted-foreground">
                    {version
                        ? t('appVersion', { version })
                        : t('appVersionLoading')}
                </footer>
            </aside>
            <div className="min-w-0 flex-1 overflow-auto">
                <div className="sticky top-0 z-20 flex h-14 items-center justify-end border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <Button
                        aria-label={t('notificationsBell')}
                        className="relative"
                        onClick={() => {
                            navigateTo('/notifications');
                        }}
                        size="icon"
                        title={t('notificationsBell')}
                        type="button"
                        variant="outline"
                    >
                        <Bell className="size-4" />
                        {notifications.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-destructive-foreground">
                                {notifications.unreadCount}
                            </span>
                        )}
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
}

function NavItem({
    active,
    href,
    icon,
    label,
    badge,
}: {
    active: boolean;
    badge?: number;
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
            <span className="min-w-0 flex-1">{label}</span>
            {badge ? (
                <Badge className="h-5 min-w-5 justify-center px-1.5 text-xs">
                    {badge}
                </Badge>
            ) : null}
        </a>
    );
}

type NotificationsState = {
    error: Error | null;
    isLoading: boolean;
    markAllRead: () => Promise<void>;
    markRead: (notificationId: string) => Promise<void>;
    notifications: EmployeeNotification[];
    retry: () => void;
    unreadCount: number;
};

function NotificationsView({
    notifications,
}: {
    notifications: NotificationsState;
}) {
    const { direction, t } = useI18n();

    return (
        <main className="min-h-[calc(100vh-3.5rem)] bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-normal">
                            {t('notificationsTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('notificationsSubtitle')}
                        </p>
                    </div>
                    <Button
                        disabled={
                            notifications.unreadCount === 0 ||
                            notifications.isLoading
                        }
                        onClick={() => {
                            void notifications.markAllRead();
                        }}
                        type="button"
                        variant="outline"
                    >
                        <CheckCheck className="size-4" />
                        {t('markAllNotificationsRead')}
                    </Button>
                </header>

                {notifications.error && (
                    <Alert variant="destructive">
                        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span>{t('loadNotificationsError')}</span>
                            <Button
                                onClick={notifications.retry}
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

                {notifications.isLoading ? (
                    <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-muted-foreground">
                        <Spinner className="size-5" />
                        <span>{t('loadingNotifications')}</span>
                    </div>
                ) : notifications.notifications.length === 0 ? (
                    <section className="rounded-md border bg-card p-8 text-center text-card-foreground">
                        <Inbox className="mx-auto size-10 text-muted-foreground" />
                        <h2 className="mt-4 text-base font-medium">
                            {t('notificationsEmptyTitle')}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('notificationsEmptyDescription')}
                        </p>
                    </section>
                ) : (
                    <section className="overflow-hidden rounded-md border bg-card text-card-foreground">
                        <div className="divide-y">
                            {notifications.notifications.map((notification) => (
                                <NotificationListItem
                                    direction={direction}
                                    key={notification.id}
                                    notification={notification}
                                    onMarkRead={() => {
                                        void notifications.markRead(
                                            notification.id,
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </section>
        </main>
    );
}

function NotificationListItem({
    direction,
    notification,
    onMarkRead,
}: {
    direction: 'ltr' | 'rtl';
    notification: EmployeeNotification;
    onMarkRead: () => void;
}) {
    const { t } = useI18n();
    const unread = !notification.readAt;

    return (
        <article className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{notification.employeeName}</h2>
                    {unread && (
                        <Badge variant="default">
                            {t('notificationUnread')}
                        </Badge>
                    )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('contractNotificationMessage', {
                        count: notification.intervalDays,
                        employee: notification.employeeName,
                    })}
                </p>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                        <dt className="text-muted-foreground">
                            {t('contractEndDate')}
                        </dt>
                        <dd>
                            {formatDate(
                                notification.contractEndDate,
                                direction,
                            )}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">
                            {t('notificationCreatedAt')}
                        </dt>
                        <dd>
                            {formatDateTime(notification.createdAt, direction)}
                        </dd>
                    </div>
                </dl>
            </div>
            <Button
                disabled={!unread}
                onClick={onMarkRead}
                size="sm"
                type="button"
                variant="outline"
            >
                <CheckCheck className="size-4" />
                {unread ? t('markNotificationRead') : t('notificationRead')}
            </Button>
        </article>
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
                                    'pointer-events-none absolute top-1 left-1 size-5 rounded-full bg-background shadow-sm transition-transform',
                                    startup.preference.enabled
                                        ? 'translate-x-5'
                                        : 'translate-x-0',
                                )}
                            />
                        </button>
                    </div>
                </section>
            </section>
        </main>
    );
}

function formatDate(value: string, direction: 'ltr' | 'rtl'): string {
    return new Intl.DateTimeFormat(direction === 'rtl' ? 'ar-EG' : 'en-US', {
        dateStyle: 'medium',
    }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string, direction: 'ltr' | 'rtl'): string {
    return new Intl.DateTimeFormat(direction === 'rtl' ? 'ar-EG' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
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
        currentView === 'settings'
            ? 'settingsTitle'
            : currentView === 'notifications'
              ? 'notificationsTitle'
              : 'dashboardTitle';

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
