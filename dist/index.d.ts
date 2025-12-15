import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, PropsWithChildren, FC } from 'react';

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
    layout?: 'full' | 'compact';
    onLayoutToggle?: () => void;
}
declare const MainMenuFull: ({ layout, onLayoutToggle, ...restProps }: MainMenuFullProps) => react_jsx_runtime.JSX.Element;

interface MenuItem {
    client_id: string;
    app_name: string;
    link: string;
    description?: string;
    icon?: string;
    order?: number;
    available?: boolean;
}
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
interface ScMainMenuProps extends Omit<MainMenuFullProps, 'layout' | 'onLayoutToggle' | 'theme' | 'onThemeToggle' | 'apps'> {
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
declare const ScMainMenu: ({ apps, dataUrl, baseUrl, menuId, fetchOptions, fetcher, useMockData, mockData, onAppsLoaded, onError, iconResolver, defaultLayout, layout, onLayoutChange, defaultTheme, theme, onThemeChange, ...rest }: ScMainMenuProps) => react_jsx_runtime.JSX.Element;

interface LayoutProps extends PropsWithChildren {
    menuProps?: Omit<ScMainMenuProps, 'layout' | 'theme'>;
    initialMenuLayout?: 'full' | 'compact';
    initialTheme?: Theme;
    upperMenuSlot?: ReactNode;
}
declare const Layout: ({ children, menuProps, initialMenuLayout, initialTheme, upperMenuSlot, }: LayoutProps) => react_jsx_runtime.JSX.Element;

interface MainMenuBaseProps extends BaseMenuProps {
    layout: 'full' | 'compact';
    onLayoutToggle?: () => void;
}
declare const MainMenuBase: ({ layout, apps, activeAppId, onAppClick, theme, onThemeToggle, systemTitle, systemLogoUrl, rightSlot, centerOverride, className, onLayoutToggle, }: MainMenuBaseProps) => react_jsx_runtime.JSX.Element;

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

/**
 * Получить текущую тему из localStorage
 */
declare function getCurrentTheme(): Theme;
/**
 * Хук для получения текущей темы с автоматическим обновлением
 */
declare function useTheme(): Theme;

export { type AppDescriptor, type BaseMenuProps, Layout, type LayoutProps, MainMenuBase, MainMenuFull, type MainMenuFullProps, PageLabel, ScMainMenu, type ScMainMenuProps, type Theme, UpperMenu, type UpperMenuProps, getCurrentTheme, useTheme };
