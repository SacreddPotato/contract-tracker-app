import type { Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { supabaseRuntime } from '@/lib/supabase';

export type SupabaseAnonymousUserErrorReason =
    | 'configurationMissing'
    | 'anonymousSignInFailed'
    | 'authStateUnavailable';

type SupabaseAnonymousUserState = {
    error: Error | null;
    errorReason: SupabaseAnonymousUserErrorReason | null;
    isLoading: boolean;
    session: Session | null;
    user: User | null;
};

export function useSupabaseAnonymousUser(): SupabaseAnonymousUserState {
    const [state, setState] = useState<SupabaseAnonymousUserState>(() =>
        supabaseRuntime
            ? {
                  error: null,
                  errorReason: null,
                  isLoading: true,
                  session: null,
                  user: null,
              }
            : {
                  error: new Error('Supabase is not configured.'),
                  errorReason: 'configurationMissing',
                  isLoading: false,
                  session: null,
                  user: null,
              },
    );

    useEffect(() => {
        if (!supabaseRuntime) {
            return;
        }

        const client = supabaseRuntime.client;
        let cancelled = false;

        async function ensureAnonymousSession() {
            setState((current) => ({
                ...current,
                isLoading: true,
            }));

            const { data: existingSession, error: sessionError } =
                await client.auth.getSession();

            if (cancelled) {
                return;
            }

            if (sessionError) {
                setState({
                    error: sessionError,
                    errorReason: 'authStateUnavailable',
                    isLoading: false,
                    session: null,
                    user: null,
                });

                return;
            }

            if (existingSession.session) {
                setState({
                    error: null,
                    errorReason: null,
                    isLoading: false,
                    session: existingSession.session,
                    user: existingSession.session.user,
                });

                return;
            }

            const { data, error } = await client.auth.signInAnonymously();

            if (cancelled) {
                return;
            }

            if (error || !data.session) {
                setState({
                    error: error ?? new Error('Anonymous sign-in failed.'),
                    errorReason: 'anonymousSignInFailed',
                    isLoading: false,
                    session: null,
                    user: null,
                });

                return;
            }

            setState({
                error: null,
                errorReason: null,
                isLoading: false,
                session: data.session,
                user: data.session.user,
            });
        }

        const {
            data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
            setState((current) => ({
                ...current,
                session,
                user: session?.user ?? null,
            }));
        });

        void ensureAnonymousSession();

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    return state;
}
