import { Maximize2, Minimize2, Minus, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { controlAppWindow } from '@/services/app-window';
import type { AppWindowAction } from '@/services/app-window';

const appName = import.meta.env.VITE_APP_NAME || 'Contract Tracker';

export function AppTitlebar() {
    const { t } = useI18n();
    const [isMaximized, setIsMaximized] = useState(false);

    async function runWindowAction(action: AppWindowAction) {
        const result = await controlAppWindow(action);

        if (result.status !== 'handled') {
            return;
        }

        if (action === 'maximize') {
            setIsMaximized(true);
        }

        if (action === 'restore') {
            setIsMaximized(false);
        }
    }

    const maximizeAction: AppWindowAction = isMaximized
        ? 'restore'
        : 'maximize';

    return (
        <div className="app-drag-region fixed inset-x-0 top-0 z-40 flex h-10 items-center justify-between border-b bg-background/95 text-foreground shadow-sm backdrop-blur">
            <div className="truncate px-4 text-sm font-medium">{appName}</div>
            <div className="app-no-drag flex h-full">
                <TitlebarButton
                    label={t('windowMinimize')}
                    onClick={() => {
                        void runWindowAction('minimize');
                    }}
                >
                    <Minus className="size-4" />
                </TitlebarButton>
                <TitlebarButton
                    label={
                        isMaximized ? t('windowRestore') : t('windowMaximize')
                    }
                    onClick={() => {
                        void runWindowAction(maximizeAction);
                    }}
                >
                    {isMaximized ? (
                        <Minimize2 className="size-3.5" />
                    ) : (
                        <Maximize2 className="size-3.5" />
                    )}
                </TitlebarButton>
                <TitlebarButton
                    className="hover:bg-red-600 hover:text-white"
                    label={t('windowClose')}
                    onClick={() => {
                        void runWindowAction('close');
                    }}
                >
                    <X className="size-4" />
                </TitlebarButton>
            </div>
        </div>
    );
}

function TitlebarButton({
    children,
    className,
    label,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            aria-label={label}
            className={cn(
                'flex h-10 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-60',
                className,
            )}
            onClick={onClick}
            title={label}
            type="button"
        >
            {children}
        </button>
    );
}
