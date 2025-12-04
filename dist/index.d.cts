import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode, PropsWithChildren, FC } from 'react';

type Theme = 'light' | 'dark';
interface AppDescriptor {
    id: string;
    name: string;
    shortName?: string;
    /** Внешний URL (куда переходим при клике) */
    href?: string;
    /** Внутренний роут, если когда-нибудь понадобится */
    routeName?: string;
    /** Локальная иконка в виде React-узла */
    iconNode?: ReactNode;
    /** Старый вариант с URL, можно оставить как fallback */
    iconUrl?: string;
}
interface BaseMenuProps {
    apps?: AppDescriptor[];
    activeAppId?: string;
    onAppClick?: (app: AppDescriptor) => void;
    theme?: Theme;
    onThemeToggle?: () => void;
    className?: string;
    systemTitle?: string;
    systemLogoUrl?: string;
    centerOverride?: ReactNode;
    rightSlot?: ReactNode;
}

interface MainMenuFullProps extends BaseMenuProps {
    layout?: "full" | "compact";
    onLayoutToggle?: () => void;
}
declare const MainMenuFull: React.FC<MainMenuFullProps>;

interface MenuItem {
    client_id: string;
    app_name: string;
    link: string;
    description?: string;
    icon: string;
    order?: number;
    available?: boolean;
}
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
interface ScMainMenuProps extends Omit<React.ComponentProps<typeof MainMenuFull>, 'layout' | 'onLayoutToggle' | 'theme' | 'onThemeToggle' | 'apps'> {
    apps?: AppDescriptor[];
    dataUrl?: string;
    baseUrl?: string;
    menuId?: string;
    fetchOptions?: RequestInit;
    fetcher?: Fetcher;
    useMockData?: boolean;
    mockData?: MenuItem[];
    onAppsLoaded?: (apps: AppDescriptor[]) => void;
    onError?: (error: unknown) => void;
    iconResolver?: (item: MenuItem, index: number) => AppDescriptor;
    defaultLayout?: 'full' | 'compact';
    layout?: 'full' | 'compact';
    defaultTheme?: Theme;
    theme?: Theme;
    onLayoutChange?: (layout: 'full' | 'compact') => void;
    onThemeChange?: (theme: Theme) => void;
}
declare const ScMainMenu: React.FC<ScMainMenuProps>;

interface LayoutProps extends PropsWithChildren {
    menuProps?: Omit<ScMainMenuProps, 'layout' | 'theme'>;
    initialMenuLayout?: 'full' | 'compact';
    initialTheme?: Theme;
    headerTitle?: string;
    headerSubtitle?: string;
    upperMenuSlot?: ReactNode;
    pageLabelSlot?: ReactNode;
    footerLeft?: ReactNode;
    footerRight?: ReactNode;
}
declare const Layout: ({ children, menuProps, initialMenuLayout, initialTheme, headerTitle, headerSubtitle, upperMenuSlot, pageLabelSlot, footerLeft, footerRight, }: LayoutProps) => react_jsx_runtime.JSX.Element;

interface MainMenuBaseProps$1 extends BaseMenuProps {
    layout: 'full' | 'compact';
    onLayoutToggle?: () => void;
}
declare const MainMenuBase$1: React.FC<MainMenuBaseProps$1>;

interface MainMenuBaseProps extends BaseMenuProps {
    layout: 'full' | 'compact';
}
declare const MainMenuBase: React.FC<MainMenuBaseProps>;

interface UpperMenuProps {
    title?: string;
    subtitle?: string;
    rightSlot?: ReactNode;
}
declare const UpperMenu: ({ title, subtitle, rightSlot, }: UpperMenuProps) => react_jsx_runtime.JSX.Element;

type PageLabelProps = {
    title: string;
    subtitle: string;
};
declare const PageLabel: FC<PageLabelProps>;

export { type AppDescriptor, type BaseMenuProps, Layout, type LayoutProps, MainMenuBase$1 as MainMenuBase, MainMenuBase as MainMenuCompact, MainMenuFull, type MainMenuFullProps, PageLabel, ScMainMenu, type ScMainMenuProps, type Theme, UpperMenu, type UpperMenuProps };
