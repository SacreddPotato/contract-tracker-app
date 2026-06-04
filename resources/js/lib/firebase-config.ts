export type FirebaseWebConfig = {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
};

type RawFirebaseWebConfig = Partial<
    Record<keyof FirebaseWebConfig, string | null | undefined>
>;

const requiredConfigKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
] as const;

export function resolveFirebaseConfig({
    runtimeConfig = {},
    viteConfig = {},
}: {
    runtimeConfig?: RawFirebaseWebConfig;
    viteConfig?: RawFirebaseWebConfig;
} = {}): FirebaseWebConfig {
    return {
        ...normalizeFirebaseConfig(viteConfig),
        ...withoutEmptyValues(normalizeFirebaseConfig(runtimeConfig)),
    };
}

export function hasRequiredFirebaseConfig(config: FirebaseWebConfig): boolean {
    return requiredConfigKeys.every((key) => Boolean(config[key]));
}

function normalizeFirebaseConfig(
    config: RawFirebaseWebConfig,
): FirebaseWebConfig {
    return {
        apiKey: normalizeConfigValue(config.apiKey),
        appId: normalizeConfigValue(config.appId),
        authDomain: normalizeConfigValue(config.authDomain),
        messagingSenderId: normalizeConfigValue(config.messagingSenderId),
        projectId: normalizeConfigValue(config.projectId),
        storageBucket: normalizeConfigValue(config.storageBucket),
    };
}

function normalizeConfigValue(
    value: string | null | undefined,
): string | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmedValue = value.trim();

    return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function withoutEmptyValues(config: FirebaseWebConfig): FirebaseWebConfig {
    return Object.fromEntries(
        Object.entries(config).filter(([, value]) => value !== undefined),
    ) as FirebaseWebConfig;
}
