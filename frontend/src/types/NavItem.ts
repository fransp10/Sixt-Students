import type { ComponentType, SVGProps } from "react";

export type NavItemType = {
  label: string;
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
};
