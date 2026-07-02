// src/components/MainMenu/MainMenu.types.ts
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
export type MenuLayout = 'full' | 'compact'

export interface AppDescriptor {
  id: string
  appId?: string
  /** @deprecated Use appId instead. */
  clientId?: string
  name: string
  shortName?: string

  /** Внешний URL (куда переходим при клике) */
  href?: string

  /** Внутренний роут, если когда-нибудь понадобится */
  routeName?: string

  /** Локальная иконка в виде React-узла */
  iconNode?: ReactNode

  /** Старый вариант с URL, можно оставить как fallback */
  iconUrl?: string
}

export interface BaseMenuProps {
  apps?: AppDescriptor[]
  activeAppId?: string
  onAppClick?: (app: AppDescriptor) => void
  theme?: Theme
  onThemeToggle?: () => void
  className?: string
  systemTitle?: string
  systemLogoUrl?: string
  centerOverride?: ReactNode
  rightSlot?: ReactNode
}
