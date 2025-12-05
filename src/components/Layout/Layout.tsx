import {
  useEffect,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import PageLabel from '../PageLabel'
import ScMainMenu, { type ScMainMenuProps } from '../MainMenu/ScMainMenu'
import UpperMenu from '../UpperMenu'
import type { Theme } from '../MainMenu/MainMenu.types'
import styles from './styles.module.scss'

const THEME_STORAGE_KEY = 'tot-ui-kit-theme'

export interface LayoutProps extends PropsWithChildren {
  menuProps?: Omit<ScMainMenuProps, 'layout' | 'theme'>
  initialMenuLayout?: 'full' | 'compact'
  initialTheme?: Theme
  headerTitle?: string
  headerSubtitle?: string
  upperMenuSlot?: ReactNode
  pageLabelSlot?: ReactNode
  footerLeft?: ReactNode
  footerRight?: ReactNode
}

const Layout = ({
  children,
  menuProps = {},
  initialMenuLayout = 'compact',
  initialTheme = 'light',
  headerTitle = 'Центр программного обеспечения',
  headerSubtitle = 'Инстанс ladoga.sberanalytics.ru',
  upperMenuSlot,
  pageLabelSlot,
  footerLeft = '© СберАналитика',
  footerRight = 'ЦПО / SC',
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
    <div className={appClassName} style={{ paddingLeft: `${sidebarWidth}px` }}>
      <ScMainMenu
        {...menuProps}
        layout={menuLayout}
        theme={theme}
        onLayoutChange={handleLayoutChange}
        onThemeChange={handleThemeChange}
      />

      <header className={styles.header}>
        {upperMenuSlot ?? <UpperMenu />}
        {pageLabelSlot ?? (
          <PageLabel title={headerTitle} subtitle={headerSubtitle} />
        )}
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </footer>
    </div>
  )
}

export default Layout
