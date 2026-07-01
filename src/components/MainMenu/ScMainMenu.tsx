// src/components/MainMenu/ScMainMenu.tsx
import { type ComponentType, type SVGProps, useEffect, useState } from 'react'

import {
  AppsGridIcon,
  DownloadsCenterIcon,
  MetadataIcon,
  NavigatorIcon,
  NetworkSquaresIcon,
  QuestionIcon,
  TableManagerIcon,
  TransformationIcon,
  UserPickIcon,
  UsersIcon,
} from '../../assets/icons'
import type { AppDescriptor, Theme } from './MainMenu.types'
import MainMenuFull, { type MainMenuFullProps } from './MainMenuFull'

interface MenuItem {
  app_id: string
  app_name: string
  link: string
  description?: string
  icon?: string // deprecated - иконки теперь определяются по app_id
  available?: boolean
}

let defaultMockMenuData: MenuItem[] | null = null

const loadDefaultMockMenuData = async (): Promise<MenuItem[]> => {
  if (defaultMockMenuData) {
    return defaultMockMenuData
  }

  try {
    const module = await import('../../data/singleMenuData.json')
    const json =
      (module as { default?: MenuItem[] }).default ?? ([] as MenuItem[])
    defaultMockMenuData = json
    return json
  } catch {
    defaultMockMenuData = []
    return []
  }
}

const mapMenuItemsToApps = (
  items: MenuItem[],
  iconResolver?: (item: MenuItem, index: number) => AppDescriptor
): AppDescriptor[] => {
  const filtered = items.filter((item) => item.available !== false)

  return filtered.map((item, index) =>
    iconResolver
      ? iconResolver(item, index)
      : {
          id: `${item.app_id}:${index}`,
          appId: item.app_id,
          clientId: item.app_id,
          name: item.app_name,
          shortName: item.app_name,
          href: item.link,
          iconNode: resolveIconNode(item),
        }
  )
}

// Маппинг иконок по app_id приложения
// Иконки прошиты в библиотеке и не зависят от бэкенда
const appIconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  dashboard: AppsGridIcon,
  users: UsersIcon,
  sc: DownloadsCenterIcon,
  dwh_bridge: NetworkSquaresIcon,
  transformation: TransformationIcon,
  table_manager: TableManagerIcon,
  metadata: MetadataIcon,
  navigator: NavigatorIcon,
  profile: UserPickIcon,
  profil: UserPickIcon,
  question: QuestionIcon,
}

const resolveIconNode = (item: MenuItem) => {
  const IconComponent = appIconMap[item.app_id] ?? AppsGridIcon
  return <IconComponent width={20} height={20} />
}

const DEFAULT_MENU_ENDPOINT = '/iam/menu/'
const MENU_ID_PLACEHOLDER = ':menuId'

const normalizeMenuEndpoint = (menuEndpoint: string): string =>
  menuEndpoint.startsWith('/') ? menuEndpoint : `/${menuEndpoint}`

const buildMenuDataUrl = (
  baseUrl?: string,
  menuId?: string,
  menuEndpoint = DEFAULT_MENU_ENDPOINT
): string | undefined => {
  if (!baseUrl) {
    return undefined
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedEndpoint = normalizeMenuEndpoint(menuEndpoint)
  const endpoint = menuId
    ? normalizedEndpoint.replace(MENU_ID_PLACEHOLDER, menuId)
    : normalizedEndpoint.replace(`/${MENU_ID_PLACEHOLDER}`, '')
  const normalizedPath = endpoint.replace(/\/{2,}/g, '/')
  const pathWithoutTrailingSlash = normalizedPath.replace(/\/+$/, '')

  if (
    pathWithoutTrailingSlash &&
    normalizedBase.endsWith(pathWithoutTrailingSlash)
  ) {
    return normalizedPath.endsWith('/') ? `${normalizedBase}/` : normalizedBase
  }

  return `${normalizedBase}${normalizedPath}`
}

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>

export interface ScMainMenuProps
  extends Omit<
    MainMenuFullProps,
    'layout' | 'onLayoutToggle' | 'theme' | 'onThemeToggle' | 'apps'
  > {
  apps?: AppDescriptor[]
  dataUrl?: string
  baseUrl?: string
  menuEndpoint?: string
  menuId?: string
  fetchOptions?: RequestInit
  fetcher?: Fetcher
  useMockData?: boolean
  mockData?: MenuItem[]
  onAppsLoaded?: (apps: AppDescriptor[]) => void
  onError?: (error: unknown) => void
  iconResolver?: (item: MenuItem, index: number) => AppDescriptor
  defaultLayout?: 'full' | 'compact'
  layout?: 'full' | 'compact'
  defaultTheme?: Theme
  theme?: Theme
  onLayoutChange?: (layout: 'full' | 'compact') => void
  onThemeChange?: (theme: Theme) => void
}

const ScMainMenu = ({
  apps,
  dataUrl,
  baseUrl,
  menuEndpoint,
  menuId,
  fetchOptions,
  fetcher,
  useMockData,
  mockData,
  onAppsLoaded,
  onError,
  iconResolver,
  defaultLayout = 'compact',
  layout,
  onLayoutChange,
  defaultTheme = 'light',
  theme,
  onThemeChange,
  ...rest
}: ScMainMenuProps) => {
  const resolvedDataUrl =
    dataUrl ?? buildMenuDataUrl(baseUrl, menuId, menuEndpoint)

  const [internalApps, setInternalApps] = useState<AppDescriptor[]>(apps ?? [])
  const [internalLayout, setInternalLayout] = useState<'full' | 'compact'>(
    defaultLayout
  )
  const [internalTheme, setInternalTheme] = useState<Theme>(defaultTheme)

  const currentLayout = layout ?? internalLayout
  const currentTheme = theme ?? internalTheme

  useEffect(() => {
    if (apps) {
      setInternalApps(apps)
    }
  }, [apps])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (useMockData) {
        const source =
          mockData && mockData.length > 0
            ? mockData
            : await loadDefaultMockMenuData()

        if (cancelled) {
          return
        }

        const mapped = mapMenuItemsToApps(source, iconResolver)

        setInternalApps(mapped)
        onAppsLoaded?.(mapped)
        return
      }

      if (!resolvedDataUrl) {
        return
      }

      const fetchFn = fetcher ?? fetch
      try {
        const res = await fetchFn(resolvedDataUrl, {
          headers: { accept: '*/*' },
          ...fetchOptions,
        })

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = (await res.json()) as MenuItem[]

        if (cancelled) {
          return
        }

        const mapped = mapMenuItemsToApps(data, iconResolver)

        setInternalApps(mapped)
        onAppsLoaded?.(mapped)
      } catch (error) {
        if (!cancelled) {
          setInternalApps([])
          onError?.(error)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [
    resolvedDataUrl,
    fetcher,
    fetchOptions,
    iconResolver,
    onAppsLoaded,
    onError,
    useMockData,
    mockData,
    menuEndpoint,
  ])

  const toggleLayout = () => {
    const next = currentLayout === 'compact' ? 'full' : 'compact'
    if (layout === undefined) {
      setInternalLayout(next)
    }
    onLayoutChange?.(next)
  }

  const toggleTheme = () => {
    const next: Theme = currentTheme === 'light' ? 'dark' : 'light'
    if (theme === undefined) {
      setInternalTheme(next)
    }
    onThemeChange?.(next)
  }

  return (
    <MainMenuFull
      {...rest}
      apps={apps ?? internalApps}
      layout={currentLayout}
      onLayoutToggle={toggleLayout}
      theme={currentTheme}
      onThemeToggle={toggleTheme}
    />
  )
}

export default ScMainMenu
