import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

function LastMonthStat({
  lastMonthValue,
  currentValue,
}: {
  lastMonthValue: string;
  currentValue: string;
}) {
  const percentageChange = Math.round(
    ((parseFloat(currentValue) - parseFloat(lastMonthValue)) /
      parseFloat(lastMonthValue)) *
      100,
  );

  return (
    <div className="mt-2 flex items-center gap-1.5">
      {percentageChange > 0 ? (
        <ArrowTrendingUpIcon className="size-4 text-green-500" />
      ) : (
        <ArrowTrendingDownIcon className="size-4 text-red-500" />
      )}
      <span
        className={`"text-xs font-medium ${percentageChange > 0 ? "text-green-500" : "text-red-500"}`}
      >
        {percentageChange}%
      </span>
      <span className="text-xs text-secondaryText">vs last month</span>
    </div>
  );
}

export default LastMonthStat;
