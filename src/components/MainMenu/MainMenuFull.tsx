// src/components/MainMenu/MainMenuFull.tsx
import React from "react";
import MainMenuBase from "./MainMenuBase";
import type { BaseMenuProps } from "./MainMenu.types";

export interface MainMenuFullProps extends BaseMenuProps {
  layout?: "full" | "compact";
  onLayoutToggle?: () => void;
}

const MainMenuFull: React.FC<MainMenuFullProps> = (props) => {
  const { layout = "compact", onLayoutToggle, ...restProps } = props;
  return <MainMenuBase {...restProps} layout={layout} onLayoutToggle={onLayoutToggle} />;
};

export default MainMenuFull;
