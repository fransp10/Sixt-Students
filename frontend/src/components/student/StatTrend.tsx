import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

function StatTrend({
  value,
  previous,
  format,
  higherIsBetter,
  comparisonLabel,
}: {
  value: number;
  previous: number;
  format: (n: number) => string;
  higherIsBetter: boolean;
  comparisonLabel: string;
}) {
  const change = value - previous;
  const formattedChange = format(Math.abs(change));


  if (formattedChange === format(0)) {
    return (
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-xs text-pending">Same as {comparisonLabel}</span>
      </div>
    );
  }

  const isUp = change > 0;
  const isGood = isUp === higherIsBetter;
  const color = isGood ? "text-green-500" : "text-red-500";
  const Arrow = isUp ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div className="mt-2 flex items-center gap-1.5">
      <Arrow className={`size-4 ${color}`} />
      <span className={`text-xs font-medium ${color}`}>
        {isUp ? "+" : "-"}
        {formattedChange}
      </span>
      <span className="text-xs text-secondaryText">
        vs {comparisonLabel}
      </span>
    </div>
  );
}

export default StatTrend;
