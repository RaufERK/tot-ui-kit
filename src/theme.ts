import { useEffect, useState } from 'react'

import type { Theme } from './components/MainMenu/MainMenu.types'

const THEME_STORAGE_KEY = 'tot-ui-kit-theme'

/**
 * Получить текущую тему из localStorage
 */
export function getCurrentTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch {
    // ignore
  }
  return 'light' // default theme
}

/**
 * Хук для получения текущей темы с автоматическим обновлением
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(getCurrentTheme)

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === THEME_STORAGE_KEY &&
        (e.newValue === 'light' || e.newValue === 'dark')
      ) {
        setTheme(e.newValue)
      }
    }

    // Слушаем изменения в localStorage
    window.addEventListener('storage', handleStorageChange)

    // Также проверяем изменения в том же окне (для случаев когда тема меняется в том же табе)
    const checkTheme = () => {
      const currentTheme = getCurrentTheme()
      if (currentTheme !== theme) {
        setTheme(currentTheme)
      }
    }

    // Проверяем каждые 100ms на изменения
    const interval = setInterval(checkTheme, 100)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [theme])

  return theme
}













