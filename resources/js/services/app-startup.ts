export type AppStartupStatus = 'handled' | 'unavailable';

export type AppStartupPreference = {
    enabled: boolean;
    status: AppStartupStatus;
};

export type AppStartupFetcher = (
    input: RequestInfo | URL,
    init?: RequestInit,
) => Promise<Response>;

const appStartupPath = '/api/app/startup';

function isStartupStatus(status: unknown): status is AppStartupStatus {
    return status === 'handled' || status === 'unavailable';
}

function normalizePreference(payload: unknown): AppStartupPreference {
    const preference = payload as Partial<AppStartupPreference>;

    if (
        typeof preference.enabled !== 'boolean' ||
        !isStartupStatus(preference.status)
    ) {
        return unavailablePreference();
    }

    return {
        enabled: preference.enabled,
        status: preference.status,
    };
}

function unavailablePreference(): AppStartupPreference {
    return {
        enabled: false,
        status: 'unavailable',
    };
}

export async function getStartupPreference({
    fetcher = fetch,
}: {
    fetcher?: AppStartupFetcher;
} = {}): Promise<AppStartupPreference> {
    const response = await fetcher(appStartupPath, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        return unavailablePreference();
    }

    return normalizePreference(await response.json());
}

export async function setStartupPreference(
    enabled: boolean,
    {
        fetcher = fetch,
    }: {
        fetcher?: AppStartupFetcher;
    } = {},
): Promise<AppStartupPreference> {
    const response = await fetcher(appStartupPath, {
        body: JSON.stringify({ enabled }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });

    if (!response.ok) {
        return unavailablePreference();
    }

    return normalizePreference(await response.json());
}
