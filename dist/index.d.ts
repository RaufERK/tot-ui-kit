import * as react from 'react';
import { ReactNode, PropsWithChildren, FC } from 'react';

type Theme = 'light' | 'dark';
type MenuLayout = 'full' | 'compact';
interface AppDescriptor {
    id: string;
    appId?: string;
    /** @deprecated Use appId instead. */
    clientId?: string;
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
    layout?: MenuLayout;
    onLayoutToggle?: () => void;
}
declare const MainMenuFull: ({ layout, onLayoutToggle, ...restProps }: MainMenuFullProps) => react.JSX.Element;

interface MenuItem {
    app_id: string;
    app_name: string;
    link: string;
    description?: string;
    icon?: string;
    available?: boolean;
}
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
interface ScMainMenuProps extends Omit<MainMenuFullProps, 'layout' | 'onLayoutToggle' | 'theme' | 'onThemeToggle' | 'apps'> {
    apps?: AppDescriptor[];
    dataUrl?: string;
    baseUrl?: string;
    menuEndpoint?: string;
    menuId?: string;
    fetchOptions?: RequestInit;
    fetcher?: Fetcher;
    useMockData?: boolean;
    mockData?: MenuItem[];
    onAppsLoaded?: (apps: AppDescriptor[]) => void;
    onError?: (error: unknown) => void;
    iconResolver?: (item: MenuItem, index: number) => AppDescriptor;
    defaultLayout?: MenuLayout;
    layout?: MenuLayout;
    defaultTheme?: Theme;
    theme?: Theme;
    onLayoutChange?: (layout: MenuLayout) => void;
    onThemeChange?: (theme: Theme) => void;
}
declare const ScMainMenu: ({ apps, dataUrl, baseUrl, menuEndpoint, menuId, fetchOptions, fetcher, useMockData, mockData, onAppsLoaded, onError, iconResolver, defaultLayout, layout, onLayoutChange, defaultTheme, theme, onThemeChange, ...rest }: ScMainMenuProps) => react.JSX.Element;

interface LayoutProps extends PropsWithChildren {
    menuProps?: Omit<ScMainMenuProps, 'layout' | 'theme'>;
    initialMenuLayout?: MenuLayout;
    initialTheme?: Theme;
    pageBackgroundColor?: string;
    contentBackgroundColor?: string;
    menuBackgroundColor?: string;
}
declare const Layout: ({ children, menuProps, initialMenuLayout, initialTheme, pageBackgroundColor, contentBackgroundColor, menuBackgroundColor, }: LayoutProps) => react.JSX.Element;

interface MainMenuBaseProps extends BaseMenuProps {
    layout: MenuLayout;
    onLayoutToggle?: () => void;
}
declare const MainMenuBase: ({ layout, apps, activeAppId, onAppClick, theme, onThemeToggle, systemTitle, systemLogoUrl, rightSlot, centerOverride, className, onLayoutToggle, }: MainMenuBaseProps) => react.JSX.Element;

type PageLabelProps = {
    title: string;
    subtitle: string;
};
declare const PageLabel: FC<PageLabelProps>;

interface UpperMenuProps {
    title?: string;
    subtitle?: string;
    rightSlot?: ReactNode;
}
declare const UpperMenu: ({ title, subtitle, rightSlot, }: UpperMenuProps) => react.JSX.Element;

/**
 * Получить текущую тему из URL, localStorage или cookie
 */
declare function getCurrentTheme(defaultTheme?: Theme): Theme;
declare function setCurrentTheme(theme: Theme): void;
declare function applyThemeToDocument(theme: Theme): void;
declare function getCurrentMenuLayout(defaultLayout?: MenuLayout): MenuLayout;
declare function setCurrentMenuLayout(layout: MenuLayout): void;
declare function getHrefWithMenuPreferences(href: string | undefined, theme: Theme | undefined, menuLayout: MenuLayout | undefined): string | undefined;
declare function getHrefWithTheme(href: string | undefined, theme: Theme | undefined): string | undefined;
/**
 * Хук для получения текущей темы с автоматическим обновлением
 */
declare function useTheme(defaultTheme?: Theme): Theme;
declare function useMenuLayout(defaultLayout?: MenuLayout): MenuLayout;

export { type AppDescriptor, type BaseMenuProps, Layout, type LayoutProps, MainMenuBase, MainMenuFull, type MainMenuFullProps, type MenuLayout, PageLabel, ScMainMenu, type ScMainMenuProps, type Theme, UpperMenu, type UpperMenuProps, applyThemeToDocument, getCurrentMenuLayout, getCurrentTheme, getHrefWithMenuPreferences, getHrefWithTheme, setCurrentMenuLayout, setCurrentTheme, useMenuLayout, useTheme };
