/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_API_TOKEN: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_NEON_DATABASE_BRANCH: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
