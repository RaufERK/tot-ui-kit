// src/components/MainMenu/MainMenuBase.tsx
import { isValidElement, cloneElement, type ReactElement } from 'react'
import styles from './MainMenu.module.css'
import type { AppDescriptor, BaseMenuProps, Theme } from './MainMenu.types'
import { MoonIcon, SunIcon, ChevronLeftIcon } from '../../assets/icons'

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
                    <span className={styles.appIcon}>
                      {isValidElement(app.iconNode)
                        ? cloneElement(app.iconNode as ReactElement, {
                            width: 20,
                            height: 20,
                          })
                        : app.iconNode}
                    </span>
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
        {onThemeToggle && (
          <>
            <button
              type='button'
              className={styles.appItem}
              onClick={onThemeToggle}
              title='Переключить тему'
            >
              <span className={styles.appIcon}>
                {theme === 'dark' ? (
                  <SunIcon width={16} height={16} />
                ) : (
                  <MoonIcon width={16} height={16} />
                )}
              </span>
              <span className={styles.appName}>
                {theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
              </span>
            </button>
            <hr className={styles.divider} />
          </>
        )}

        {rightSlot}

        {onLayoutToggle && (
          <>
            <hr className={styles.divider} />
            <button
              type='button'
              className={styles.toggleButton}
              onClick={onLayoutToggle}
              title={layout === 'compact' ? 'Развернуть меню' : 'Свернуть меню'}
            >
              <span
                className={`${styles.toggleIcon} ${
                  layout === 'full' ? styles.toggleIconRotated : ''
                }`}
              >
                <ChevronLeftIcon width={16} height={16} />
              </span>
              <span className={styles.toggleText}>
                {layout === 'compact' ? 'Развернуть' : 'Свернуть'}
              </span>
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default MainMenuBase
export { MainMenuBase }
