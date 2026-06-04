import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Contract Tracker';

type RouteDefinition = {
    title: string;
    eyebrow: string;
    body: string;
};

const routes: Record<string, RouteDefinition> = {
    '/': {
        title: 'Contract Tracker',
        eyebrow: 'Workspace',
        body: 'React owns this application shell. Laravel serves backend API endpoints only.',
    },
    '/dashboard': {
        title: 'Dashboard',
        eyebrow: 'Overview',
        body: 'Track contract work from a frontend-owned dashboard backed by Laravel API data.',
    },
    '/settings/profile': {
        title: 'Profile settings',
        eyebrow: 'Settings',
        body: 'Profile data is loaded and updated through API endpoints.',
    },
    '/settings/security': {
        title: 'Security settings',
        eyebrow: 'Settings',
        body: 'Security and password actions are handled through backend API endpoints.',
    },
    '/login': {
        title: 'Log in',
        eyebrow: 'Authentication',
        body: 'Authentication screens are owned by React while Laravel handles auth requests.',
    },
    '/register': {
        title: 'Register',
        eyebrow: 'Authentication',
        body: 'Registration screens are owned by React while Laravel handles user creation.',
    },
    '/forgot-password': {
        title: 'Forgot password',
        eyebrow: 'Authentication',
        body: 'Password reset requests are submitted to Laravel API/auth endpoints.',
    },
    '/verify-email': {
        title: 'Verify email',
        eyebrow: 'Authentication',
        body: 'Email verification status is handled by Laravel while this page stays in React.',
    },
    '/confirm-password': {
        title: 'Confirm password',
        eyebrow: 'Authentication',
        body: 'Password confirmation is a backend action initiated from a React-owned page.',
    },
    '/two-factor-challenge': {
        title: 'Two-factor challenge',
        eyebrow: 'Authentication',
        body: 'Two-factor challenges are presented by React and verified by Laravel.',
    },
};

function currentRoute(): RouteDefinition {
    if (window.location.pathname.startsWith('/reset-password/')) {
        return {
            title: 'Reset password',
            eyebrow: 'Authentication',
            body: 'Password reset forms are rendered by React and submitted to Laravel.',
        };
    }

    return (
        routes[window.location.pathname] ?? {
            title: 'Not found',
            eyebrow: 'React route',
            body: 'This route is handled by the React app shell.',
        }
    );
}

function App() {
    const route = currentRoute();

    useEffect(() => {
        document.title = `${route.title} - ${appName}`;
    }, [route.title]);

    return (
        <TooltipProvider delayDuration={0}>
            <main className="min-h-screen bg-background text-foreground">
                <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-12">
                    <p className="text-sm font-medium text-muted-foreground">
                        {route.eyebrow}
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-normal">
                        {route.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                        {route.body}
                    </p>
                    <nav className="mt-8 flex flex-wrap gap-3 text-sm">
                        <a
                            className="rounded-md border px-3 py-2 hover:bg-accent"
                            href="/dashboard"
                        >
                            Dashboard
                        </a>
                        <a
                            className="rounded-md border px-3 py-2 hover:bg-accent"
                            href="/settings/profile"
                        >
                            Profile
                        </a>
                        <a
                            className="rounded-md border px-3 py-2 hover:bg-accent"
                            href="/settings/security"
                        >
                            Security
                        </a>
                    </nav>
                </section>
            </main>
            <Toaster />
        </TooltipProvider>
    );
}

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

initializeTheme();
