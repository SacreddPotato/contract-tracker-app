import { useMemo, useState } from 'react';

import {
    hasRequiredAppApiConfig,
    resolveAppApiConfig,
} from '@/lib/app-api-config';

export type AppApiTokenState = {
    databaseBranch: 'testing' | 'production';
    databaseBranchToggleEnabled: boolean;
    error: Error | null;
    errorReason: 'configurationMissing' | null;
    isLoading: false;
    setDatabaseBranch: (branch: 'testing' | 'production') => void;
    token: string | null;
};

const databaseBranchStorageKey = 'contract-tracker-dev-database-branch';

export function useAppApiToken(): AppApiTokenState {
    const config = useMemo(
        () =>
            resolveAppApiConfig({
                runtimeConfig:
                    typeof window === 'undefined'
                        ? undefined
                        : window.__contractTrackerConfig?.api,
                viteConfig: {
                    databaseBranch: import.meta.env.VITE_NEON_DATABASE_BRANCH,
                    databaseBranchToggleEnabled: false,
                    token: import.meta.env.VITE_APP_API_TOKEN,
                },
            }),
        [],
    );
    const defaultDatabaseBranch = config.databaseBranch ?? 'production';
    const [databaseBranch, setDatabaseBranchState] = useState<
        'testing' | 'production'
    >(() => {
        if (
            !config.databaseBranchToggleEnabled ||
            typeof window === 'undefined'
        ) {
            return defaultDatabaseBranch;
        }

        const storedBranch = window.localStorage.getItem(
            databaseBranchStorageKey,
        );

        return storedBranch === 'production' || storedBranch === 'testing'
            ? storedBranch
            : defaultDatabaseBranch;
    });

    return useMemo(() => {
        function setDatabaseBranch(branch: 'testing' | 'production') {
            setDatabaseBranchState(branch);

            if (
                config.databaseBranchToggleEnabled &&
                typeof window !== 'undefined'
            ) {
                window.localStorage.setItem(databaseBranchStorageKey, branch);
            }
        }

        if (!hasRequiredAppApiConfig(config)) {
            return {
                databaseBranch,
                databaseBranchToggleEnabled:
                    config.databaseBranchToggleEnabled === true,
                error: new Error('The app API token is not configured.'),
                errorReason: 'configurationMissing',
                isLoading: false,
                setDatabaseBranch,
                token: null,
            };
        }

        return {
            databaseBranch,
            databaseBranchToggleEnabled:
                config.databaseBranchToggleEnabled === true,
            error: null,
            errorReason: null,
            isLoading: false,
            setDatabaseBranch,
            token: config.token ?? null,
        };
    }, [config, databaseBranch]);
}
