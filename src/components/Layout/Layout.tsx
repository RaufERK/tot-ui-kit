import {
  useEffect,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import ScMainMenu, { type ScMainMenuProps } from '../MainMenu/ScMainMenu'
import type { Theme } from '../MainMenu/MainMenu.types'
import './styles.css'
const styles = {
  app: 'sc-layout',
  theme_light: 'sc-layout_theme_light',
  theme_dark: 'sc-layout_theme_dark',
  menu_full: 'sc-layout_menu_full',
  menu_compact: 'sc-layout_menu_compact',
  main: 'sc-layout__main',
  upperMenu: 'sc-layout__upper-menu',
}

const THEME_STORAGE_KEY = 'tot-ui-kit-theme'

export interface LayoutProps extends PropsWithChildren {
  menuProps?: Omit<ScMainMenuProps, 'layout' | 'theme'>
  initialMenuLayout?: 'full' | 'compact'
  initialTheme?: Theme
  upperMenuSlot?: ReactNode
  menuBackgroundColor?: string
  pageBackgroundColor?: string
}

const Layout = ({
  children,
  menuProps = {},
  initialMenuLayout = 'compact',
  initialTheme = 'light',
  upperMenuSlot,
  menuBackgroundColor,
  pageBackgroundColor,
}: LayoutProps) => {
  const [menuLayout, setMenuLayout] = useState<'full' | 'compact'>(
    initialMenuLayout
  )
  const [theme, setTheme] = useState<Theme>(initialTheme)

  // подхватываем сохранённую тему из localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved)
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.classList.remove('triplex-theme-light', 'triplex-theme-dark')
    root.classList.add(
      theme === 'dark' ? 'triplex-theme-dark' : 'triplex-theme-light'
    )

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const sidebarWidth = menuLayout === 'full' ? 220 : 48

  const appClassName = [
    styles.app,
    styles[`theme_${theme}`],
    styles[`menu_${menuLayout}`],
  ]
    .filter(Boolean)
    .join(' ')

  const handleLayoutChange = (next: 'full' | 'compact') => {
    setMenuLayout(next)
    menuProps.onLayoutChange?.(next)
  }

  const handleThemeChange = (next: Theme) => {
    setTheme(next)
    menuProps.onThemeChange?.(next)
  }

  return (
    <div
      className={appClassName}
      style={
        {
          paddingLeft: `${sidebarWidth}px`,
          '--menu-bg-color': menuBackgroundColor || 'rgba(255, 255, 255, 0.03)',
          '--page-bg-color': pageBackgroundColor,
        } as React.CSSProperties
      }
    >
      <ScMainMenu
        {...menuProps}
        layout={menuLayout}
        theme={theme}
        onLayoutChange={handleLayoutChange}
        onThemeChange={handleThemeChange}
      />

      {upperMenuSlot && <div className={styles.upperMenu}>{upperMenuSlot}</div>}

      <main className={styles.main}>{children}</main>
    </div>
  )
}

export default Layout
