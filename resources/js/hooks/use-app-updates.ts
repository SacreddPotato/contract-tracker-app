import { useCallback, useEffect, useState } from 'react';

import {
    checkForAppUpdates,
    checkForAppUpdatesOnStartup,
    getAppVersion,
} from '@/services/app-updates';
import type {
    AppUpdateCheckResult,
    AppUpdateStatus,
    AppVersionMetadata,
} from '@/services/app-updates';

export type AppUpdateState = {
    checkNow: () => Promise<AppUpdateCheckResult>;
    isChecking: boolean;
    status: AppUpdateStatus | null;
    version: AppVersionMetadata | null;
};

export function useAppUpdates({
    checkOnStartup = false,
}: {
    checkOnStartup?: boolean;
} = {}): AppUpdateState {
    const [version, setVersion] = useState<AppVersionMetadata | null>(null);
    const [status, setStatus] = useState<AppUpdateStatus | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        let cancelled = false;

        void getAppVersion()
            .then((metadata) => {
                if (!cancelled) {
                    setVersion(metadata);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setVersion(null);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const checkNow = useCallback(async () => {
        setIsChecking(true);

        try {
            const result = await checkForAppUpdates();
            setStatus(result.status);

            return result;
        } finally {
            setIsChecking(false);
        }
    }, []);

    useEffect(() => {
        if (!checkOnStartup) {
            return;
        }

        let cancelled = false;

        void checkForAppUpdatesOnStartup().then((result) => {
            if (!cancelled && result) {
                setStatus(result.status);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [checkOnStartup]);

    return {
        checkNow,
        isChecking,
        status,
        version,
    };
}
