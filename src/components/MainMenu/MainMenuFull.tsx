// src/components/MainMenu/MainMenuFull.tsx
import type { BaseMenuProps, MenuLayout } from './MainMenu.types'
import MainMenuBase from './MainMenuBase'

export interface MainMenuFullProps extends BaseMenuProps {
  layout?: MenuLayout
  onLayoutToggle?: () => void
}

const MainMenuFull = ({
  layout = 'compact',
  onLayoutToggle,
  ...restProps
}: MainMenuFullProps) => (
  <MainMenuBase
    {...restProps}
    layout={layout}
    onLayoutToggle={onLayoutToggle}
  />
)

export default MainMenuFull
