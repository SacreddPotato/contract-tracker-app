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
    const response = await fetcher(`/api/app/window/${action}`, {
        method: 'POST',
    });

    return (await response.json()) as AppWindowControlResult;
}

export function isNativeRuntime(): boolean {
    return window.__contractTrackerConfig?.native?.running === true;
}
