// src/components/MainMenu/MainMenuBase.tsx
import React from 'react'
import styles from './MainMenu.module.css'
import type { BaseMenuProps, Theme, AppDescriptor } from './MainMenu.types'

export interface MainMenuBaseProps extends BaseMenuProps {
  layout: 'full' | 'compact'
}

const getThemeClassName = (theme: Theme | undefined) => {
  if (theme === 'dark') {
    return styles.root_theme_dark
  }
  return styles.root_theme_light
}

const MainMenuBase: React.FC<MainMenuBaseProps> = (props) => {
  const {
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
  } = props

  const rootClassName = [styles.root, getThemeClassName(theme), className]
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

  const handleThemeToggle = () => {
    if (onThemeToggle) {
      onThemeToggle()
    }
  }

  return (
    <nav className={rootClassName} aria-label='Главное меню приложений'>
      {/* Верхняя часть — логотип/название системы */}
      <div className={styles.left}>
        {systemLogoUrl && (
          <img
            src={systemLogoUrl}
            alt={systemTitle}
            className={styles.systemLogo}
          />
        )}
        {systemTitle && (
          <div className={styles.systemTitle} title={systemTitle}>
            {systemTitle}
          </div>
        )}
      </div>

      {/* Центральная часть — список приложений */}
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
                  {app.iconUrl && (
                    <img
                      src={app.iconUrl}
                      alt={app.name}
                      className={styles.appIcon}
                    />
                  )}
                  {/* подпись скрывается через CSS (display: none) */}
                  <span className={styles.appName}>
                    {app.shortName ?? app.name}
                  </span>
                </button>
              )
            })}
          </>
        )}
      </div>

      {/* Нижняя часть — переключатель темы + правый слот */}
      <div className={styles.right}>
        {onThemeToggle && (
          <button
            type='button'
            className={styles.appItem}
            onClick={handleThemeToggle}
            title='Переключить тему'
          >
            <span className={styles.appIcon}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </button>
        )}

        {rightSlot}
      </div>
    </nav>
  )
}

export default MainMenuBase
export { MainMenuBase }
