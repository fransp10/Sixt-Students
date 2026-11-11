import type { ComponentType, SVGProps } from "react";
import StatTrend from "./StatTrend";
import { formatStat } from "../../helpers/formatStat";

type StatsCardProps = {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  value: number;
  previous?: number; // undefined = "no data", 0 = a real zero
  format?: (n: number) => string; // used for both the value and the change
  detail?: string; // text after the value that isn't compared, e.g. "of 21 shifts"
  higherIsBetter?: boolean; // defaults to true
  comparisonLabel?: string; // "last month" / "average month", omit to hide the comparison
};

function StatsCard({
  title,
  icon: Icon,
  value,
  previous,
  format = (n) => formatStat(n),
  detail,
  higherIsBetter = true,
  comparisonLabel,
}: StatsCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-borderDividers bg-cardBG p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <p className="truncate text-sm font-medium text-secondaryText">
          {title}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-2xl font-semibold tabular-nums text-primaryText">
          {format(value)}
          {detail && (
            <span className="ml-1 text-sm font-normal text-secondaryText">
              {detail}
            </span>
          )}
        </p>
        {comparisonLabel !== undefined &&
          (previous !== undefined ? (
            <StatTrend
              value={value}
              previous={previous}
              format={format}
              higherIsBetter={higherIsBetter}
              comparisonLabel={comparisonLabel}
            />
          ) : (
            <p className="mt-2 flex min-h-6 items-center text-xs text-secondaryText">
              No data for {comparisonLabel}
            </p>
          ))}
      </div>
    </div>
  );
}

export default StatsCard;
