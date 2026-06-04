import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import {
    hasRequiredSupabaseConfig,
    resolveSupabaseConfig,
} from '@/lib/supabase-config';
import type { SupabaseWebConfig } from '@/lib/supabase-config';

type SupabaseRuntime = {
    client: SupabaseClient;
};

const viteSupabaseConfig: SupabaseWebConfig = {
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    url: import.meta.env.VITE_SUPABASE_URL,
};

const supabaseConfig = resolveSupabaseConfig({
    runtimeConfig:
        typeof window === 'undefined'
            ? undefined
            : window.__contractTrackerConfig?.supabase,
    viteConfig: viteSupabaseConfig,
});

export const hasSupabaseConfig = hasRequiredSupabaseConfig(supabaseConfig);

export const supabaseRuntime: SupabaseRuntime | null = hasSupabaseConfig
    ? {
          client: createClient(
              supabaseConfig.url ?? '',
              supabaseConfig.publishableKey ?? '',
          ),
      }
    : null;
