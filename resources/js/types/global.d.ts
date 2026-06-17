export {};

declare global {
    interface Window {
        __contractTrackerConfig?: {
            native?: Partial<{
                running: boolean;
            }>;
            api?: Partial<{
                databaseBranch: 'testing' | 'production' | null;
                databaseBranchHeader: string | null;
                databaseBranchToggleEnabled: boolean | null;
                token: string | null;
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
