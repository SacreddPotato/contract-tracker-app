export {};

declare global {
    interface Window {
        __contractTrackerConfig?: {
            native?: Partial<{
                running: boolean;
            }>;
            supabase?: Partial<{
                publishableKey: string | null;
                url: string | null;
            }>;
        };
    }
}

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}
