// src/components/MainMenu/MainMenuBase.tsx
import './MainMenu.css'

import {
  ChevronLeftIcon,
  MoonIcon,
  QuestionIcon,
  SunIcon,
  UserPickIcon,
} from '../../assets/icons'
import {
  getHrefWithMenuPreferences,
  setCurrentMenuLayout,
  setCurrentTheme,
} from '../../theme'
import type {
  AppDescriptor,
  BaseMenuProps,
  MenuLayout,
  Theme,
} from './MainMenu.types'

const styles = {
  root: 'sc-main-menu',
  layout_full: 'sc-main-menu_layout_full',
  layout_compact: 'sc-main-menu_layout_compact',
  root_theme_light: 'sc-main-menu_theme_light',
  root_theme_dark: 'sc-main-menu_theme_dark',
  left: 'sc-main-menu__left',
  systemLogo: 'sc-main-menu__systemLogo',
  center: 'sc-main-menu__center',
  right: 'sc-main-menu__right',
  divider: 'sc-main-menu__divider',
  appItem: 'sc-main-menu__appItem',
  appItem_active: 'sc-main-menu__appItem_active',
  appIcon: 'sc-main-menu__appIcon',
  toggleButton: 'sc-main-menu__toggleButton',
  toggleIcon: 'sc-main-menu__toggleIcon',
  toggleIconRotated: 'sc-main-menu__toggleIconRotated',
  toggleText: 'sc-main-menu__toggleText',
  appName: 'sc-main-menu__appName',
  controls: 'sc-main-menu__controls',
  controlButton: 'sc-main-menu__controlButton',
  controlIcon: 'sc-main-menu__controlIcon',
  controlText: 'sc-main-menu__controlText',
  controlDivider: 'sc-main-menu__controlDivider',
}

export interface MainMenuBaseProps extends BaseMenuProps {
  layout: MenuLayout
  onLayoutToggle?: () => void
}

const getThemeClassName = (theme: Theme | undefined) =>
  theme === 'dark' ? styles.root_theme_dark : styles.root_theme_light

const PROFILE_APP_ID = 'profile'
const HELP_APP_ID = 'help'
const SERVICE_APP_IDS = new Set([PROFILE_APP_ID, HELP_APP_ID])

const getAppId = (app: AppDescriptor) =>
  app.appId ?? app.clientId ?? app.id.split(':')[0]

const MainMenuBase = ({
  layout,
  apps = [],
  activeAppId,
  onAppClick,
  theme,
  onThemeToggle,
  systemTitle = 'Центр установок',
  systemLogoUrl,
  rightSlot,
  centerOverride,
  className,
  onLayoutToggle,
}: MainMenuBaseProps) => {
  const rootClassName = [
    styles.root,
    styles[`layout_${layout}`],
    getThemeClassName(theme),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleAppClick = (app: AppDescriptor) => {
    if (theme) {
      setCurrentTheme(theme)
    }
    setCurrentMenuLayout(layout)

    if (onAppClick) {
      onAppClick(app)
      return
    }
    if (app.href) {
      window.location.href =
        getHrefWithMenuPreferences(app.href, theme, layout) ?? app.href
    }
  }

  const visibleApps = apps.filter((app) => !SERVICE_APP_IDS.has(getAppId(app)))
  const findServiceApp = (ids: string[]) =>
    apps.find((app) => {
      const appId = getAppId(app)
      return ids.includes(appId) || ids.some((id) => app.id.startsWith(`${id}:`))
    })

  const profileApp = findServiceApp([PROFILE_APP_ID])
  const helpApp = findServiceApp([HELP_APP_ID])
  const themeToggleLabel = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'
  const layoutToggleLabel =
    layout === 'compact' ? 'Развернуть меню' : 'Свернуть меню'

  return (
    <nav className={rootClassName} aria-label='Главное меню приложений'>
      {systemLogoUrl && (
        <div className={styles.left}>
          <img
            src={systemLogoUrl}
            alt={systemTitle}
            className={styles.systemLogo}
          />
        </div>
      )}

      <div className={styles.center}>
        {centerOverride ?? (
          <>
            {visibleApps.map((app) => {
              const isActive =
                app.id === activeAppId ||
                app.appId === activeAppId ||
                app.clientId === activeAppId
              const appClassName = [
                styles.appItem,
                isActive ? styles.appItem_active : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <button
                  key={app.id + (app.href ?? '')}
                  type='button'
                  className={appClassName}
                  onClick={() => handleAppClick(app)}
                  title={app.name}
                >
                  {app.iconNode ? (
                    <span className={styles.appIcon}>{app.iconNode}</span>
                  ) : app.iconUrl ? (
                    <img
                      src={app.iconUrl}
                      alt={app.name}
                      className={styles.appIcon}
                    />
                  ) : null}

                  <span className={styles.appName}>
                    {app.shortName ?? app.name}
                  </span>
                </button>
              )
            })}
          </>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.controls}>
          {profileApp && (
            <button
              type='button'
              className={styles.controlButton}
              onClick={() => handleAppClick(profileApp)}
              title={profileApp.name}
              aria-label={profileApp.name}
            >
              <span className={styles.controlIcon}>
                <UserPickIcon width={16} height={16} />
              </span>
              <span className={styles.controlText}>
                {profileApp.shortName ?? profileApp.name}
              </span>
            </button>
          )}

          {rightSlot ??
            (helpApp ? (
              <button
                type='button'
                className={styles.controlButton}
                onClick={() => handleAppClick(helpApp)}
                title={helpApp.name}
                aria-label={helpApp.name}
              >
                <span className={styles.controlIcon}>
                  <QuestionIcon width={16} height={16} />
                </span>
                <span className={styles.controlText}>
                  {helpApp.shortName ?? helpApp.name}
                </span>
              </button>
            ) : null)}

          {onThemeToggle && (
            <>
              <hr className={styles.controlDivider} />
              <button
                type='button'
                className={styles.controlButton}
                onClick={onThemeToggle}
                title={themeToggleLabel}
                aria-label={themeToggleLabel}
              >
                <span className={styles.controlIcon}>
                  {theme === 'dark' ? (
                    <SunIcon width={16} height={16} />
                  ) : (
                    <MoonIcon width={16} height={16} />
                  )}
                </span>
                <span className={styles.controlText}>{themeToggleLabel}</span>
              </button>
            </>
          )}

          {onLayoutToggle && (
            <>
              <hr className={styles.controlDivider} />
              <button
                type='button'
                className={styles.controlButton}
                onClick={onLayoutToggle}
                title={layoutToggleLabel}
                aria-label={layoutToggleLabel}
              >
                <span
                  className={`${styles.controlIcon} ${styles.toggleIcon} ${
                    layout === 'full' ? styles.toggleIconRotated : ''
                  }`}
                >
                  <ChevronLeftIcon width={16} height={16} />
                </span>
                <span className={styles.controlText}>{layoutToggleLabel}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default MainMenuBase
export { MainMenuBase }
