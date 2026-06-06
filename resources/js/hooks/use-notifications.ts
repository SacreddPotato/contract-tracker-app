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
): NotificationsState {
    const [state, setState] = useState<NotificationSubscriptionState>({
        accessToken: null,
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
        let cancelled = false;

        async function loadNotifications() {
            await syncContractNotifications({
                accessToken: currentAccessToken,
            });
            const [notifications, unreadCount] = await Promise.all([
                listNotifications({ accessToken: currentAccessToken }),
                unreadNotificationCount({ accessToken: currentAccessToken }),
            ]);

            if (cancelled) {
                return;
            }

            setState({
                accessToken: currentAccessToken,
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
    }, [accessToken, subscriptionKey]);

    const markRead = useCallback(
        async (notificationId: string) => {
            if (!accessToken) {
                throw new Error('Notification storage is unavailable.');
            }

            const notification = await markNotificationRead(notificationId, {
                accessToken,
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
        [accessToken],
    );

    const markAllRead = useCallback(async () => {
        if (!accessToken) {
            throw new Error('Notification storage is unavailable.');
        }

        const unreadCount = await markAllNotificationsRead({ accessToken });
        const readAt = new Date().toISOString();

        setState((current) => ({
            ...current,
            notifications: current.notifications.map((notification) => ({
                ...notification,
                readAt: notification.readAt ?? readAt,
            })),
            unreadCount,
        }));
    }, [accessToken]);

    return {
        error: state.accessToken === accessToken ? state.error : null,
        isLoading:
            Boolean(accessToken) &&
            (state.accessToken !== accessToken ||
                state.subscriptionKey !== subscriptionKey),
        markAllRead,
        markRead,
        notifications:
            state.accessToken === accessToken ? state.notifications : [],
        retry: () => {
            setSubscriptionKey((key) => key + 1);
        },
        unreadCount: state.accessToken === accessToken ? state.unreadCount : 0,
    };
}
