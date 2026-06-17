import { useCallback, useEffect, useState } from 'react';

import {
    listNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    nextUnreadCountAfterMarkRead,
    syncContractNotifications,
    unreadNotificationCount,
} from '@/services/notification-api';
import type { EmployeeNotification } from '@/services/notification-api';

type NotificationSubscriptionState = {
    accessToken: string | null;
    databaseBranch: 'testing' | 'production' | null;
    error: Error | null;
    notifications: EmployeeNotification[];
    subscriptionKey: number;
    unreadCount: number;
};

type NotificationsState = {
    error: Error | null;
    isLoading: boolean;
    markAllRead: () => Promise<void>;
    markRead: (notificationId: string) => Promise<void>;
    notifications: EmployeeNotification[];
    retry: () => void;
    unreadCount: number;
};

export function useNotifications(
    accessToken: string | null,
    databaseBranch: 'testing' | 'production' | null = null,
): NotificationsState {
    const [state, setState] = useState<NotificationSubscriptionState>({
        accessToken: null,
        databaseBranch: null,
        error: null,
        notifications: [],
        subscriptionKey: 0,
        unreadCount: 0,
    });
    const [subscriptionKey, setSubscriptionKey] = useState(0);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const currentAccessToken = accessToken;
        const currentDatabaseBranch = databaseBranch;
        let cancelled = false;

        async function loadNotifications() {
            await syncContractNotifications({
                accessToken: currentAccessToken,
                databaseBranch: currentDatabaseBranch,
            });
            const [notifications, unreadCount] = await Promise.all([
                listNotifications({
                    accessToken: currentAccessToken,
                    databaseBranch: currentDatabaseBranch,
                }),
                unreadNotificationCount({
                    accessToken: currentAccessToken,
                    databaseBranch: currentDatabaseBranch,
                }),
            ]);

            if (cancelled) {
                return;
            }

            setState({
                accessToken: currentAccessToken,
                databaseBranch: currentDatabaseBranch,
                error: null,
                notifications,
                subscriptionKey,
                unreadCount,
            });
        }

        void loadNotifications().catch((nextError: unknown) => {
            if (cancelled) {
                return;
            }

            setState({
                accessToken: currentAccessToken,
                databaseBranch: currentDatabaseBranch,
                error:
                    nextError instanceof Error
                        ? nextError
                        : new Error('Unable to load notifications.'),
                notifications: [],
                subscriptionKey,
                unreadCount: 0,
            });
        });

        return () => {
            cancelled = true;
        };
    }, [accessToken, databaseBranch, subscriptionKey]);

    const markRead = useCallback(
        async (notificationId: string) => {
            if (!accessToken) {
                throw new Error('Notification storage is unavailable.');
            }

            const notification = await markNotificationRead(notificationId, {
                accessToken,
                databaseBranch,
            });

            setState((current) => ({
                ...current,
                notifications: current.notifications.map(
                    (currentNotification) =>
                        currentNotification.id === notification.id
                            ? notification
                            : currentNotification,
                ),
                unreadCount: nextUnreadCountAfterMarkRead(
                    current.notifications,
                    notification,
                    current.unreadCount,
                ),
            }));
        },
        [accessToken, databaseBranch],
    );

    const markAllRead = useCallback(async () => {
        if (!accessToken) {
            throw new Error('Notification storage is unavailable.');
        }

        const unreadCount = await markAllNotificationsRead({
            accessToken,
            databaseBranch,
        });
        const readAt = new Date().toISOString();

        setState((current) => ({
            ...current,
            notifications: current.notifications.map((notification) => ({
                ...notification,
                readAt: notification.readAt ?? readAt,
            })),
            unreadCount,
        }));
    }, [accessToken, databaseBranch]);

    return {
        error:
            state.accessToken === accessToken &&
            state.databaseBranch === databaseBranch
                ? state.error
                : null,
        isLoading:
            Boolean(accessToken) &&
            (state.accessToken !== accessToken ||
                state.databaseBranch !== databaseBranch ||
                state.subscriptionKey !== subscriptionKey),
        markAllRead,
        markRead,
        notifications:
            state.accessToken === accessToken &&
            state.databaseBranch === databaseBranch
                ? state.notifications
                : [],
        retry: () => {
            setSubscriptionKey((key) => key + 1);
        },
        unreadCount:
            state.accessToken === accessToken &&
            state.databaseBranch === databaseBranch
                ? state.unreadCount
                : 0,
    };
}
