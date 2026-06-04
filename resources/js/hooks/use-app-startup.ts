import { useCallback, useEffect, useState } from 'react';

import {
    getStartupPreference,
    setStartupPreference,
} from '@/services/app-startup';
import type { AppStartupPreference } from '@/services/app-startup';

export type AppStartupState = {
    isLoading: boolean;
    isSaving: boolean;
    preference: AppStartupPreference;
    setEnabled: (enabled: boolean) => Promise<AppStartupPreference>;
};

const initialPreference: AppStartupPreference = {
    enabled: false,
    status: 'unavailable',
};

export function useAppStartup(): AppStartupState {
    const [preference, setPreference] =
        useState<AppStartupPreference>(initialPreference);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        void getStartupPreference()
            .then((result) => {
                if (!cancelled) {
                    setPreference(result);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const setEnabled = useCallback(async (enabled: boolean) => {
        setIsSaving(true);

        try {
            const result = await setStartupPreference(enabled);
            setPreference(result);

            return result;
        } finally {
            setIsSaving(false);
        }
    }, []);

    return {
        isLoading,
        isSaving,
        preference,
        setEnabled,
    };
}
