// src/components/MainMenu/ScMainMenu.tsx
import React, { type SVGProps } from 'react'
import MainMenuFull from './MainMenuFull'
import type { AppDescriptor, Theme } from './MainMenu.types'
import {
  AppsGridIcon,
  NetworkSquaresIcon,
  QuestionIcon,
  UsersIcon,
  TransformationIcon,
  NavigatorIcon,
  TableManagerIcon,
} from '../../assets/icons'

interface MenuItem {
  client_id: string
  app_name: string
  link: string
  description?: string
  icon: string
  order?: number
  available?: boolean
}

const DEFAULT_MENU_ID = 'VKIIw4zpK-wnEuFag4GXO'

// Маппинг иконок по имени из бекенда
const iconMap: Record<string, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  'apps-grid': AppsGridIcon,
  users: UsersIcon,
  'network-squares': NetworkSquaresIcon,
  transformation: TransformationIcon,
  navigator: NavigatorIcon,
  'table-manager': TableManagerIcon,
  question: QuestionIcon,
}

const resolveIconNode = (item: MenuItem) => {
  const IconComponent = iconMap[item.icon] ?? AppsGridIcon
  return <IconComponent width={20} height={20} />
}

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>

export interface ScMainMenuProps
  extends Omit<
    React.ComponentProps<typeof MainMenuFull>,
    'layout' | 'onLayoutToggle' | 'theme' | 'onThemeToggle' | 'apps'
  > {
  apps?: AppDescriptor[]
  dataUrl?: string
  baseUrl?: string
  menuId?: string
  fetchOptions?: RequestInit
  fetcher?: Fetcher
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

const ScMainMenu: React.FC<ScMainMenuProps> = (props) => {
  const {
    apps,
    dataUrl,
    baseUrl,
    menuId = DEFAULT_MENU_ID,
    fetchOptions,
    fetcher,
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
  } = props

  const resolvedDataUrl =
    dataUrl ??
    (baseUrl ? `${baseUrl}/idp/single-menu-data/${menuId}` : undefined)
  const [internalApps, setInternalApps] = React.useState<AppDescriptor[]>(
    apps ?? []
  )
  const [internalLayout, setInternalLayout] = React.useState<
    'full' | 'compact'
  >(defaultLayout)
  const [internalTheme, setInternalTheme] = React.useState<Theme>(defaultTheme)

  const currentLayout = layout ?? internalLayout
  const currentTheme = theme ?? internalTheme

  React.useEffect(() => {
    if (apps) {
      setInternalApps(apps)
    }
  }, [apps])

  React.useEffect(() => {
    if (!resolvedDataUrl) {
      return
    }

    let cancelled = false
    const fetchFn = fetcher ?? fetch

    const load = async () => {
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

        const filtered = data
          .filter((item) => item.available !== false)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

        const mapped = filtered.map((item, index) =>
          iconResolver
            ? iconResolver(item, index)
            : {
                id: `${item.client_id}:${index}`,
                name: item.app_name,
                shortName: item.app_name,
                href: item.link,
                iconNode: resolveIconNode(item),
              }
        )

        setInternalApps(mapped)
        onAppsLoaded?.(mapped)
      } catch (error) {
        if (!cancelled) {
          setInternalApps([])
          onError?.(error)
          console.error('Не удалось загрузить меню', error)
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
