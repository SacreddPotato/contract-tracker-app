export type AppApiConfig = {
    databaseBranch?: 'testing' | 'production' | null;
    databaseBranchHeader?: string | null;
    databaseBranchToggleEnabled?: boolean | null;
    token?: string | null;
};

type RawAppApiConfig = Partial<{
    databaseBranch: string | null | undefined;
    databaseBranchHeader: string | null | undefined;
    databaseBranchToggleEnabled: boolean | null | undefined;
    token: string | null | undefined;
}>;

export function resolveAppApiConfig({
    runtimeConfig = {},
    viteConfig = {},
}: {
    runtimeConfig?: RawAppApiConfig;
    viteConfig?: RawAppApiConfig;
} = {}): AppApiConfig {
    return withoutEmptyValues({
        ...normalizeAppApiConfig(viteConfig),
        ...withoutEmptyValues(normalizeAppApiConfig(runtimeConfig)),
    });
}

export function hasRequiredAppApiConfig(config: AppApiConfig): boolean {
    return Boolean(config.token && config.token.trim() !== '');
}

function normalizeAppApiConfig(config: RawAppApiConfig): AppApiConfig {
    return {
        databaseBranch: normalizeDatabaseBranch(config.databaseBranch),
        databaseBranchHeader: normalizeString(config.databaseBranchHeader),
        databaseBranchToggleEnabled:
            typeof config.databaseBranchToggleEnabled === 'boolean'
                ? config.databaseBranchToggleEnabled
                : null,
        token: normalizeString(config.token),
    };
}

function normalizeDatabaseBranch(
    value: string | null | undefined,
): AppApiConfig['databaseBranch'] {
    return value === 'testing' || value === 'production' ? value : null;
}

function normalizeString(value: string | null | undefined): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();

    return trimmed === '' ? null : trimmed;
}

function withoutEmptyValues(config: AppApiConfig): AppApiConfig {
    return Object.fromEntries(
        Object.entries(config).filter(([, value]) => value !== null),
    ) as AppApiConfig;
}
