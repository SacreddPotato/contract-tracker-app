export type AppWindowAction = 'minimize' | 'maximize' | 'restore' | 'close';
export type AppWindowControlStatus = 'handled' | 'unavailable';

export type AppWindowControlResult = {
    status: AppWindowControlStatus;
};

type AppWindowControlOptions = {
    fetcher?: typeof fetch;
};

export async function controlAppWindow(
    action: AppWindowAction,
    { fetcher = fetch }: AppWindowControlOptions = {},
): Promise<AppWindowControlResult> {
    try {
        const response = await fetcher(`/api/app/window/${action}`, {
            method: 'POST',
        });

        if (!response.ok) {
            return { status: 'unavailable' };
        }

        return (await response.json()) as AppWindowControlResult;
    } catch {
        return { status: 'unavailable' };
    }
}

export function isNativeRuntime(): boolean {
    return window.__contractTrackerConfig?.native?.running === true;
}
