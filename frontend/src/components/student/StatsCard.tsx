import type { ComponentType, SVGProps } from "react";
import AvgMonthStat from "../../pages/Students/AvgMonthStat";

type StatsCardProps = {
  prefix?: string;
  sufix?: string;
  title: string;
  value: string | number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  lastMonthValue?: string | number;
  empty?: boolean;
};

function StatsCard({
  title,
  value,
  icon: Icon,
  prefix,
  sufix,
  lastMonthValue,
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
            {prefix}
            {value}
            {sufix}
          </p>
          {lastMonthValue ? (
            <AvgMonthStat
              sufix={sufix}
              prefix={prefix}
              avgMonthValue={lastMonthValue.toString()}
              currentValue={value.toString()}
            />
          ) : (
            <div className="mt-2 text-sm text-secondaryText">
              No data for last month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
