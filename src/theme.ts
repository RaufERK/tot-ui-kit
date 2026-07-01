import { useEffect, useState } from 'react'

import type { MenuLayout, Theme } from './components/MainMenu/MainMenu.types'

const THEME_STORAGE_KEY = 'tot-ui-kit-theme'
const MENU_LAYOUT_STORAGE_KEY = 'tot-ui-kit-menu-layout'
const THEME_CHANGE_EVENT = 'tot-ui-kit-theme-change'
const MENU_LAYOUT_CHANGE_EVENT = 'tot-ui-kit-menu-layout-change'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark'

const isMenuLayout = (value: unknown): value is MenuLayout =>
  value === 'full' || value === 'compact'

const getValueFromUrl = (key: string): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return new URLSearchParams(window.location.search).get(key) ?? undefined
}

const getValueFromLocalStorage = (key: string): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    return window.localStorage.getItem(key) ?? undefined
  } catch {
    return undefined
  }
}

const getValueFromCookie = (key: string): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined
  }

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${key}=`))

  return cookie
    ? decodeURIComponent(cookie.split('=').slice(1).join('='))
    : undefined
}

const getCookieDomainCandidates = () => {
  if (typeof window === 'undefined') {
    return []
  }

  const hostname = window.location.hostname
  const parts = hostname.split('.')

  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return []
  }

  if (
    hostname === 'ladoga.sberanalytics.ru' ||
    hostname.endsWith('.ladoga.sberanalytics.ru')
  ) {
    return ['.ladoga.sberanalytics.ru']
  }

  if (parts.length > 2) {
    return [`.${parts.slice(1).join('.')}`]
  }

  return []
}

const writeValueToCookie = (key: string, value: string) => {
  if (typeof document === 'undefined') {
    return
  }

  const encodedValue = encodeURIComponent(value)
  const baseCookie = `${key}=${encodedValue}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`

  document.cookie = baseCookie

  getCookieDomainCandidates().forEach((domain) => {
    document.cookie = `${baseCookie}; domain=${domain}`
  })
}

const getThemeFromUrl = (): Theme | undefined => {
  const value = getValueFromUrl(THEME_STORAGE_KEY)
  return isTheme(value) ? value : undefined
}

const getThemeFromLocalStorage = (): Theme | undefined => {
  const value = getValueFromLocalStorage(THEME_STORAGE_KEY)
  return isTheme(value) ? value : undefined
}

const getThemeFromCookie = (): Theme | undefined => {
  const value = getValueFromCookie(THEME_STORAGE_KEY)
  return isTheme(value) ? value : undefined
}

const getMenuLayoutFromUrl = (): MenuLayout | undefined => {
  const value = getValueFromUrl(MENU_LAYOUT_STORAGE_KEY)
  return isMenuLayout(value) ? value : undefined
}

const getMenuLayoutFromLocalStorage = (): MenuLayout | undefined => {
  const value = getValueFromLocalStorage(MENU_LAYOUT_STORAGE_KEY)
  return isMenuLayout(value) ? value : undefined
}

const getMenuLayoutFromCookie = (): MenuLayout | undefined => {
  const value = getValueFromCookie(MENU_LAYOUT_STORAGE_KEY)
  return isMenuLayout(value) ? value : undefined
}

const setStoredValue = (key: string, value: string, eventName: string) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }

  writeValueToCookie(key, value)
  window.dispatchEvent(new CustomEvent<string>(eventName, { detail: value }))
}

/**
 * Получить текущую тему из URL, localStorage или cookie
 */
export function getCurrentTheme(defaultTheme: Theme = 'light'): Theme {
  return (
    getThemeFromUrl() ??
    getThemeFromLocalStorage() ??
    getThemeFromCookie() ??
    defaultTheme
  )
}

export function setCurrentTheme(theme: Theme) {
  setStoredValue(THEME_STORAGE_KEY, theme, THEME_CHANGE_EVENT)
}

export function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.setAttribute('data-theme', theme)

  root.classList.remove('triplex-theme-light', 'triplex-theme-dark')
  root.classList.add(
    theme === 'dark' ? 'triplex-theme-dark' : 'triplex-theme-light',
  )

  root.classList.remove('icons-light_tptl2v', 'icons-dark_7mk9a3')
  root.classList.add(
    theme === 'dark' ? 'icons-dark_7mk9a3' : 'icons-light_tptl2v'
  )
}

export function getCurrentMenuLayout(
  defaultLayout: MenuLayout = 'compact'
): MenuLayout {
  return (
    getMenuLayoutFromUrl() ??
    getMenuLayoutFromLocalStorage() ??
    getMenuLayoutFromCookie() ??
    defaultLayout
  )
}

export function setCurrentMenuLayout(layout: MenuLayout) {
  setStoredValue(MENU_LAYOUT_STORAGE_KEY, layout, MENU_LAYOUT_CHANGE_EVENT)
}

export function getHrefWithMenuPreferences(
  href: string | undefined,
  theme: Theme | undefined,
  menuLayout: MenuLayout | undefined
) {
  if (!href || typeof window === 'undefined') {
    return href
  }

  try {
    const url = new URL(href, window.location.href)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return href
    }

    if (theme) {
      url.searchParams.set(THEME_STORAGE_KEY, theme)
    }

    if (menuLayout) {
      url.searchParams.set(MENU_LAYOUT_STORAGE_KEY, menuLayout)
    }

    return url.toString()
  } catch {
    return href
  }
}

export function getHrefWithTheme(
  href: string | undefined,
  theme: Theme | undefined
) {
  return getHrefWithMenuPreferences(href, theme, undefined)
}

/**
 * Хук для получения текущей темы с автоматическим обновлением
 */
export function useTheme(defaultTheme: Theme = 'light'): Theme {
  const [theme, setTheme] = useState<Theme>(() => getCurrentTheme(defaultTheme))

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && isTheme(e.newValue)) {
        setTheme(e.newValue)
      }
    }

    const handleThemeChange = (e: Event) => {
      const next = (e as CustomEvent<Theme>).detail
      if (isTheme(next)) {
        setTheme(next)
      }
    }

    const currentTheme = getCurrentTheme(defaultTheme)
    if (currentTheme !== theme) {
      setTheme(currentTheme)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    }
  }, [defaultTheme, theme])

  return theme
}

export function useMenuLayout(
  defaultLayout: MenuLayout = 'compact'
): MenuLayout {
  const [layout, setLayout] = useState<MenuLayout>(() =>
    getCurrentMenuLayout(defaultLayout)
  )

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MENU_LAYOUT_STORAGE_KEY && isMenuLayout(e.newValue)) {
        setLayout(e.newValue)
      }
    }

    const handleMenuLayoutChange = (e: Event) => {
      const next = (e as CustomEvent<MenuLayout>).detail
      if (isMenuLayout(next)) {
        setLayout(next)
      }
    }

    const currentLayout = getCurrentMenuLayout(defaultLayout)
    if (currentLayout !== layout) {
      setLayout(currentLayout)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(MENU_LAYOUT_CHANGE_EVENT, handleMenuLayoutChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(
        MENU_LAYOUT_CHANGE_EVENT,
        handleMenuLayoutChange
      )
    }
  }, [defaultLayout, layout])

  return layout
}
