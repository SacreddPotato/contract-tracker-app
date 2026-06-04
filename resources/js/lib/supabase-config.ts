export type SupabaseWebConfig = {
    publishableKey?: string;
    url?: string;
};

type RawSupabaseWebConfig = Partial<
    Record<keyof SupabaseWebConfig, string | null | undefined>
>;

export function resolveSupabaseConfig({
    runtimeConfig = {},
    viteConfig = {},
}: {
    runtimeConfig?: RawSupabaseWebConfig;
    viteConfig?: RawSupabaseWebConfig;
} = {}): SupabaseWebConfig {
    return {
        ...normalizeSupabaseConfig(viteConfig),
        ...withoutEmptyValues(normalizeSupabaseConfig(runtimeConfig)),
    };
}

export function hasRequiredSupabaseConfig(config: SupabaseWebConfig): boolean {
    return Boolean(config.url && config.publishableKey);
}

function normalizeSupabaseConfig(
    config: RawSupabaseWebConfig,
): SupabaseWebConfig {
    return {
        publishableKey: normalizeValue(config.publishableKey),
        url: normalizeValue(config.url),
    };
}

function normalizeValue(value: string | null | undefined): string | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmed = value.trim();

    return trimmed === '' ? undefined : trimmed;
}

function withoutEmptyValues(config: SupabaseWebConfig): SupabaseWebConfig {
    return Object.fromEntries(
        Object.entries(config).filter(([, value]) => value),
    ) as SupabaseWebConfig;
}
