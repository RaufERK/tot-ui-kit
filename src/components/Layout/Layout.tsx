import './styles.css'

import { ETriplexNextTheme, ThemeProvider } from '@sberbusiness/triplex-next'
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'

import {
  applyThemeToDocument,
  getCurrentMenuLayout,
  getCurrentTheme,
  setCurrentMenuLayout,
  setCurrentTheme,
} from '../../theme'
import type { MenuLayout, Theme } from '../MainMenu/MainMenu.types'
import ScMainMenu, { type ScMainMenuProps } from '../MainMenu/ScMainMenu'
const styles = {
  app: 'sc-layout',
  theme_light: 'sc-layout_theme_light',
  theme_dark: 'sc-layout_theme_dark',
  menu_full: 'sc-layout_menu_full',
  menu_compact: 'sc-layout_menu_compact',
  main: 'sc-layout__main',
}

export interface LayoutProps extends PropsWithChildren {
  menuProps?: Omit<ScMainMenuProps, 'layout' | 'theme'>
  initialMenuLayout?: MenuLayout
  initialTheme?: Theme
  pageBackgroundColor?: string
  contentBackgroundColor?: string
  menuBackgroundColor?: string
}

const Layout = ({
  children,
  menuProps = {},
  initialMenuLayout = 'compact',
  initialTheme = 'light',
  pageBackgroundColor,
  contentBackgroundColor,
  menuBackgroundColor,
}: LayoutProps) => {
  const [menuLayout, setMenuLayout] = useState<MenuLayout>(() =>
    getCurrentMenuLayout(initialMenuLayout)
  )

  const [theme, setTheme] = useState<Theme>(() => {
    return getCurrentTheme(initialTheme)
  })

  useEffect(() => {
    applyThemeToDocument(theme)
    setCurrentTheme(theme)
  }, [theme])

  useEffect(() => {
    setCurrentMenuLayout(menuLayout)
  }, [menuLayout])

  const sidebarWidth = menuLayout === 'full' ? 220 : 48

  const appClassName = [
    styles.app,
    styles[`theme_${theme}`],
    styles[`menu_${menuLayout}`],
  ]
    .filter(Boolean)
    .join(' ')

  const handleLayoutChange = (next: MenuLayout) => {
    setMenuLayout(next)
    menuProps.onLayoutChange?.(next)
  }

  const handleThemeChange = (next: Theme) => {
    setTheme(next)
    menuProps.onThemeChange?.(next)
  }

  // Маппинг нашей темы на Triplex тему
  const triplexTheme = theme === 'dark' ? ETriplexNextTheme.DARK : ETriplexNextTheme.LIGHT
  const scopeRef = useRef<HTMLDivElement>(null)

  return (
    <ThemeProvider theme={triplexTheme} scopeRef={scopeRef}>
      <div
        ref={scopeRef}
        className={appClassName}
        style={{
          paddingLeft: `${sidebarWidth}px`,
          ...(pageBackgroundColor ? { '--sc-page-bg': pageBackgroundColor } : {}),
          ...(contentBackgroundColor
            ? { '--sc-main-bg': contentBackgroundColor }
            : {}),
          ...(menuBackgroundColor ? { '--sc-menu-bg': menuBackgroundColor } : {}),
        }}
      >
        <ScMainMenu
          {...menuProps}
          layout={menuLayout}
          theme={theme}
          onLayoutChange={handleLayoutChange}
          onThemeChange={handleThemeChange}
        />

        <main className={styles.main}>{children}</main>
      </div>
    </ThemeProvider>
  )
}

export default Layout
