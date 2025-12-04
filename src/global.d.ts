declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg?react" {
  import { FunctionComponent, SVGProps } from "react";
  const Component: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default Component;
}








