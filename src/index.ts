import './global.css'

export { default as Layout } from './components/Layout'
export type { LayoutProps } from './components/Layout/Layout'
export type {
  AppDescriptor,
  BaseMenuProps,
  MainMenuFullProps,
  ScMainMenuProps,
  Theme,
} from './components/MainMenu'
export { MainMenuBase, MainMenuFull, ScMainMenu } from './components/MainMenu'
export { default as PageLabel } from './components/PageLabel'
export { default as UpperMenu } from './components/UpperMenu'
export type { UpperMenuProps } from './components/UpperMenu/UpperMenu'

// Theme utilities
export { getCurrentTheme, useTheme } from './theme'
