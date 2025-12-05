// src/components/MainMenu/MainMenuFull.tsx
import MainMenuBase from './MainMenuBase'
import type { BaseMenuProps } from './MainMenu.types'

export interface MainMenuFullProps extends BaseMenuProps {
  layout?: 'full' | 'compact'
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
