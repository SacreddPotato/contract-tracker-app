import type { LucideIcon } from 'lucide-react';

type UrlLike = {
    url: string;
};

export type BreadcrumbItem = {
    title: string;
    href: string | UrlLike;
};

export type NavItem = {
    title: string;
    href: string | UrlLike;
    icon?: LucideIcon | null;
    isActive?: boolean;
};
