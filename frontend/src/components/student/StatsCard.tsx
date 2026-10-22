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
    <div className="rounded-xl border h-32 flex items-center border-borderDividers bg-cardLighterBG p-5">
      <div className="flex items-start gap-4  ">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-6 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-secondaryText">{title}</p>

          <p className=" text-2xl font-semibold text-primaryText">
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
              <div className="mt-2 text-sm text-secondaryText">
                No data for {comparisonLabel}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
