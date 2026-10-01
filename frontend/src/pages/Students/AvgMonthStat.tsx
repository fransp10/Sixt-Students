import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

function AvgMonthStat({
  avgMonthValue,
  currentValue,
  sufix,
  prefix,
}: {
  sufix?: string;
  prefix?: string;
  avgMonthValue: string;
  currentValue: string;
}) {
  const change = (parseFloat(currentValue) - parseFloat(avgMonthValue)).toFixed(
    0,
  );
  return (
    <div className="mt-2 flex items-center gap-1.5">
      {Number(change) !== 0 ? (
        <>
          {Number(change) > 0 ? (
            <ArrowTrendingUpIcon className="size-4 text-green-500" />
          ) : (
            <ArrowTrendingDownIcon className="size-4 text-red-500" />
          )}
          <span
            className={`"text-xs font-medium ${Number(change) > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {Number(change) > 0 ? "+" : "-"}
            {prefix}
            {Number(change) < 0 ? change.substring(1) : change}
            {sufix}
          </span>
          <span className="text-xs text-secondaryText">vs average month</span>
        </>
      ) : (
        <span className="text-xs text-pending">Same as average month</span>
      )}
    </div>
  );
}

export default AvgMonthStat;
