import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { firebaseRuntime } from '@/lib/firebase';

export type FirebaseAnonymousUserErrorReason =
    | 'configurationMissing'
    | 'anonymousSignInFailed'
    | 'authStateUnavailable';

type FirebaseAnonymousUserState = {
    error: Error | null;
    errorReason: FirebaseAnonymousUserErrorReason | null;
    isLoading: boolean;
    user: User | null;
};

export function useFirebaseAnonymousUser(): FirebaseAnonymousUserState {
    const [state, setState] = useState<FirebaseAnonymousUserState>(() =>
        firebaseRuntime
            ? {
                  error: null,
                  errorReason: null,
                  isLoading: true,
                  user: null,
              }
            : {
                  error: new Error('Firebase is not configured.'),
                  errorReason: 'configurationMissing',
                  isLoading: false,
                  user: null,
              },
    );

    useEffect(() => {
        if (!firebaseRuntime) {
            return;
        }

        const runtime = firebaseRuntime;
        let signInStarted = false;

        const unsubscribe = onAuthStateChanged(
            runtime.auth,
            (user) => {
                if (user) {
                    setState({
                        error: null,
                        errorReason: null,
                        isLoading: false,
                        user,
                    });

                    return;
                }

                setState((current) => ({
                    ...current,
                    isLoading: true,
                    user: null,
                }));

                if (signInStarted) {
                    return;
                }

                signInStarted = true;

                void signInAnonymously(runtime.auth).catch((error) => {
                    setState({
                        error:
                            error instanceof Error
                                ? error
                                : new Error('Anonymous sign-in failed.'),
                        errorReason: 'anonymousSignInFailed',
                        isLoading: false,
                        user: null,
                    });
                });
            },
            (error) => {
                setState({
                    error,
                    errorReason: 'authStateUnavailable',
                    isLoading: false,
                    user: null,
                });
            },
        );

        return () => {
            unsubscribe();
        };
    }, []);

    return state;
}
