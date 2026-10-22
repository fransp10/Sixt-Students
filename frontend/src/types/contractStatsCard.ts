import type { ComponentType, SVGProps } from "react";

export type ContractStatsCardProps = {
  title: string;
  value: string | number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  total?: number; // renders as "value / total"
  caption?: string;
  progress?: number; // 0-100, renders a progress bar under the value
  valueClassName?: string;
  className?: string;
};
