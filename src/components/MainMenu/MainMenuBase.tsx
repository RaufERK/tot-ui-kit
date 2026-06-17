// src/components/MainMenu/MainMenuBase.tsx
import './MainMenu.css'
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
  controlDivider: 'sc-main-menu__controlDivider',
}
import {
  ChevronLeftIcon,
  MoonIcon,
  QuestionIcon,
  SunIcon,
  UserPickIcon,
} from '../../assets/icons'
import type { AppDescriptor, BaseMenuProps, Theme } from './MainMenu.types'

export interface MainMenuBaseProps extends BaseMenuProps {
  layout: 'full' | 'compact'
  onLayoutToggle?: () => void
}

const getThemeClassName = (theme: Theme | undefined) =>
  theme === 'dark' ? styles.root_theme_dark : styles.root_theme_light

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
    if (onAppClick) {
      onAppClick(app)
      return
    }
    if (app.href) {
      window.location.href = app.href
    }
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
            {apps.map((app) => {
              const isActive = app.id === activeAppId
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
          <span className={styles.controlIcon} title='Профиль'>
            <UserPickIcon width={16} height={16} />
          </span>

          {rightSlot ?? (
            <button
              type='button'
              className={styles.controlButton}
              title='Справка'
              aria-label='Справка'
            >
              <QuestionIcon width={16} height={16} />
            </button>
          )}

          {onThemeToggle && (
            <>
              <hr className={styles.controlDivider} />
              <button
                type='button'
                className={styles.controlButton}
                onClick={onThemeToggle}
                title='Переключить тему'
                aria-label='Переключить тему'
              >
                {theme === 'dark' ? (
                  <SunIcon width={16} height={16} />
                ) : (
                  <MoonIcon width={16} height={16} />
                )}
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
                title={layout === 'compact' ? 'Развернуть меню' : 'Свернуть меню'}
                aria-label={
                  layout === 'compact' ? 'Развернуть меню' : 'Свернуть меню'
                }
              >
                <span
                  className={`${styles.toggleIcon} ${
                    layout === 'full' ? styles.toggleIconRotated : ''
                  }`}
                >
                  <ChevronLeftIcon width={16} height={16} />
                </span>
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
