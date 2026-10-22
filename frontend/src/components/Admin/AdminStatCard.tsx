import type { ComponentType, SVGProps } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

type AdminStatCardProps = {
  title: string;
  value: string;
  caption: string;
  period: string; // e.g. "October"
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

function AdminStatCard({
  title,
  value,
  caption,
  period,
  icon: Icon,
}: AdminStatCardProps) {
  return (
    <div className="rounded-xl border border-borderDividers bg-cardBG p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          <p className="truncate text-sm font-medium text-secondaryText">
            {title}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-borderDividers bg-cardLighterBG px-2.5 py-0.5 text-xs text-secondaryText">
          <CalendarIcon className="size-3.5" />
          {period}
        </span>
      </div>

      <p className="mt-5 text-3xl font-semibold tabular-nums text-primaryText">
        {value}
      </p>
      <p className="mt-1 text-xs text-secondaryText">{caption}</p>
    </div>
  );
}

export default AdminStatCard;
