export type AppUpdateStatus =
    | 'checking'
    | 'disabled'
    | 'downloaded'
    | 'error'
    | 'installing'
    | 'unavailable';

export type AppUpdateCheckResult = {
    status: AppUpdateStatus;
};

export type AppVersionMetadata = {
    version: string;
    channel: string;
    provider: string;
};

export type AppUpdateFetcher = (
    input: RequestInfo | URL,
    init?: RequestInit,
) => Promise<Response>;

const appVersionPath = '/api/app/version';
const appUpdateStatusPath = '/api/app/updates/status';
const appUpdateCheckPath = '/api/app/updates/check';
const appUpdateInstallPath = '/api/app/updates/install';

function isAppUpdateStatus(status: unknown): status is AppUpdateStatus {
    return (
        status === 'checking' ||
        status === 'disabled' ||
        status === 'downloaded' ||
        status === 'error' ||
        status === 'installing' ||
        status === 'unavailable'
    );
}

export async function getAppVersion({
    fetcher = fetch,
}: {
    fetcher?: AppUpdateFetcher;
} = {}): Promise<AppVersionMetadata> {
    const response = await fetcher(appVersionPath, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Unable to load app version metadata.');
    }

    return (await response.json()) as AppVersionMetadata;
}

export async function checkForAppUpdates({
    fetcher = fetch,
}: {
    fetcher?: AppUpdateFetcher;
} = {}): Promise<AppUpdateCheckResult> {
    const response = await fetcher(appUpdateCheckPath, {
        headers: {
            Accept: 'application/json',
        },
        method: 'POST',
    });

    if (!response.ok) {
        return { status: 'unavailable' };
    }

    const payload = (await response.json()) as Partial<AppUpdateCheckResult>;

    if (!isAppUpdateStatus(payload.status)) {
        return { status: 'unavailable' };
    }

    return { status: payload.status };
}

export async function getAppUpdateStatus({
    fetcher = fetch,
}: {
    fetcher?: AppUpdateFetcher;
} = {}): Promise<AppUpdateCheckResult> {
    const response = await fetcher(appUpdateStatusPath, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        return { status: 'unavailable' };
    }

    const payload = (await response.json()) as Partial<AppUpdateCheckResult>;

    if (!isAppUpdateStatus(payload.status)) {
        return { status: 'unavailable' };
    }

    return { status: payload.status };
}

export async function installDownloadedAppUpdate({
    fetcher = fetch,
}: {
    fetcher?: AppUpdateFetcher;
} = {}): Promise<AppUpdateCheckResult> {
    const response = await fetcher(appUpdateInstallPath, {
        headers: {
            Accept: 'application/json',
        },
        method: 'POST',
    });

    if (!response.ok) {
        return { status: 'unavailable' };
    }

    const payload = (await response.json()) as Partial<AppUpdateCheckResult>;

    if (!isAppUpdateStatus(payload.status)) {
        return { status: 'unavailable' };
    }

    return { status: payload.status };
}

export function createStartupUpdateChecker(
    checker: () => Promise<AppUpdateCheckResult> = checkForAppUpdates,
): () => Promise<AppUpdateCheckResult | null> {
    let hasChecked = false;

    return async () => {
        if (hasChecked) {
            return null;
        }

        hasChecked = true;

        return checker();
    };
}

export const checkForAppUpdatesOnStartup = createStartupUpdateChecker();
