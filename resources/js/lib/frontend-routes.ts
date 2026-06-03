import type { RouteDefinition } from '@/wayfinder';

function frontendRoute(url: string): RouteDefinition<'get'> {
    return {
        url,
        method: 'get',
    };
}

export const frontendRoutes = {
    dashboard: () => frontendRoute('/dashboard'),
    profileSettings: () => frontendRoute('/settings/profile'),
    securitySettings: () => frontendRoute('/settings/security'),
    appearanceSettings: () => frontendRoute('/settings/appearance'),
};
