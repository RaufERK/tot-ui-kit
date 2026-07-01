// src/components/MainMenu/MainMenuBase.tsx
import './MainMenu.css'

import {
  ChevronLeftIcon,
  MoonIcon,
  QuestionIcon,
  SunIcon,
  UserPickIcon,
} from '../../assets/icons'
import type { AppDescriptor, BaseMenuProps, Theme } from './MainMenu.types'

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
  layout: 'full' | 'compact'
  onLayoutToggle?: () => void
}

const getThemeClassName = (theme: Theme | undefined) =>
  theme === 'dark' ? styles.root_theme_dark : styles.root_theme_light

const DEFAULT_PROFILE_APP_ID = 'profile'
const DEFAULT_PROFILE_HREF = 'https://profile.ladoga.sberanalytics.ru/'
const SERVICE_APP_IDS = new Set(['profile', 'profil', 'help', 'question'])

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
  profileAppId = DEFAULT_PROFILE_APP_ID,
  profileHref = DEFAULT_PROFILE_HREF,
  helpHref,
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
    if (onAppClick) {
      onAppClick(app)
      return
    }
    if (app.href) {
      window.location.href = app.href
    }
  }

  const profileAppIds = Array.from(
    new Set([profileAppId, 'profile', 'profil'])
  )
  const serviceAppIds = new Set([...SERVICE_APP_IDS, ...profileAppIds])
  const visibleApps = apps.filter((app) => !serviceAppIds.has(getAppId(app)))
  const findServiceApp = (ids: string[]) =>
    apps.find((app) => {
      const appId = getAppId(app)
      return ids.includes(appId) || ids.some((id) => app.id.startsWith(`${id}:`))
    })

  const profileApp = findServiceApp(profileAppIds)
  const helpApp = findServiceApp(['help', 'question'])
  const themeToggleLabel = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'
  const layoutToggleLabel =
    layout === 'compact' ? 'Развернуть меню' : 'Свернуть меню'

  const handleServiceClick = (
    app: AppDescriptor | undefined,
    fallback: AppDescriptor
  ) => {
    handleAppClick(app ?? fallback)
  }

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
          <button
            type='button'
            className={styles.controlButton}
            onClick={() =>
              handleServiceClick(profileApp, {
                id: profileAppId,
                appId: profileAppId,
                clientId: profileAppId,
                name: 'Профиль',
                href: profileHref,
              })
            }
            title='Профиль'
            aria-label='Профиль'
          >
            <span className={styles.controlIcon}>
              <UserPickIcon width={16} height={16} />
            </span>
            <span className={styles.controlText}>Профиль</span>
          </button>

          {rightSlot ?? (
            <button
              type='button'
              className={styles.controlButton}
              onClick={() =>
                handleServiceClick(helpApp, {
                  id: 'help',
                  appId: 'help',
                  clientId: 'help',
                  name: 'Помощь',
                  href: helpHref,
                })
              }
              title='Справка'
              aria-label='Справка'
            >
              <span className={styles.controlIcon}>
                <QuestionIcon width={16} height={16} />
              </span>
              <span className={styles.controlText}>Помощь</span>
            </button>
          )}

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
