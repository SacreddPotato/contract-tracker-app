type ApiCollectionResponse<T> = {
    data: T[];
};

type ApiResourceResponse<T> = {
    data: T;
};

type UnreadCountResponse = {
    unreadCount: number;
};

export type EmployeeNotification = {
    id: string;
    employeeId: string;
    employeeName: string;
    intervalDays: 90 | 60 | 30;
    contractEndDate: string;
    readAt: string | null;
    createdAt: string;
};

type NotificationApiOptions = {
    accessToken: string;
    databaseBranch?: 'testing' | 'production' | null;
    fetcher?: typeof fetch;
};

export async function syncContractNotifications({
    accessToken,
    databaseBranch = null,
    fetcher = fetch,
}: NotificationApiOptions): Promise<EmployeeNotification[]> {
    return notificationCollectionFromResponse(
        await fetcher('/api/notifications/sync', {
            headers: authorizedHeaders(accessToken, databaseBranch),
            method: 'POST',
        }),
    );
}

export async function listNotifications({
    accessToken,
    databaseBranch = null,
    fetcher = fetch,
}: NotificationApiOptions): Promise<EmployeeNotification[]> {
    return notificationCollectionFromResponse(
        await fetcher('/api/notifications', {
            headers: authorizedHeaders(accessToken, databaseBranch),
        }),
    );
}

export async function unreadNotificationCount({
    accessToken,
    databaseBranch = null,
    fetcher = fetch,
}: NotificationApiOptions): Promise<number> {
    const response = await fetcher('/api/notifications/unread-count', {
        headers: authorizedHeaders(accessToken, databaseBranch),
    });

    if (!response.ok) {
        throw new Error('Unable to load notification count.');
    }

    const payload = (await response.json()) as UnreadCountResponse;

    return payload.unreadCount;
}

export async function markNotificationRead(
    notificationId: string,
    {
        accessToken,
        databaseBranch = null,
        fetcher = fetch,
    }: NotificationApiOptions,
): Promise<EmployeeNotification> {
    return notificationFromResponse(
        await fetcher(
            `/api/notifications/${encodeURIComponent(notificationId)}/read`,
            {
                headers: authorizedHeaders(accessToken, databaseBranch),
                method: 'PATCH',
            },
        ),
    );
}

export async function markAllNotificationsRead({
    accessToken,
    databaseBranch = null,
    fetcher = fetch,
}: NotificationApiOptions): Promise<number> {
    const response = await fetcher('/api/notifications/read-all', {
        headers: authorizedHeaders(accessToken, databaseBranch),
        method: 'PATCH',
    });

    if (!response.ok) {
        throw new Error('Unable to mark notifications read.');
    }

    const payload = (await response.json()) as UnreadCountResponse;

    return payload.unreadCount;
}

export function nextUnreadCountAfterMarkRead(
    currentNotifications: EmployeeNotification[],
    updatedNotification: EmployeeNotification,
    currentUnreadCount: number,
): number {
    const existingNotification = currentNotifications.find(
        (notification) => notification.id === updatedNotification.id,
    );

    if (existingNotification?.readAt) {
        return currentUnreadCount;
    }

    return Math.max(0, currentUnreadCount - 1);
}

async function notificationCollectionFromResponse(
    response: Response,
): Promise<EmployeeNotification[]> {
    if (!response.ok) {
        throw new Error('Unable to load notifications.');
    }

    const payload =
        (await response.json()) as ApiCollectionResponse<EmployeeNotification>;

    return payload.data;
}

async function notificationFromResponse(
    response: Response,
): Promise<EmployeeNotification> {
    if (!response.ok) {
        throw new Error('Unable to update notification.');
    }

    const payload =
        (await response.json()) as ApiResourceResponse<EmployeeNotification>;

    return payload.data;
}

function authorizedHeaders(
    accessToken: string,
    databaseBranch: NotificationApiOptions['databaseBranch'] = null,
): HeadersInit {
    return withoutNullHeaders({
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-App-Database-Branch': databaseBranch,
    });
}

function withoutNullHeaders(
    headers: Record<string, string | null>,
): HeadersInit {
    return Object.fromEntries(
        Object.entries(headers).filter(([, value]) => value !== null),
    ) as Record<string, string>;
}
