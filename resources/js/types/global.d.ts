export {};

declare global {
    interface Window {
        __contractTrackerConfig?: {
            firebase?: Partial<{
                apiKey: string | null;
                appId: string | null;
                authDomain: string | null;
                messagingSenderId: string | null;
                projectId: string | null;
                storageBucket: string | null;
            }>;
            native?: Partial<{
                running: boolean;
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
