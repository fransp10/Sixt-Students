import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const rowClasses = "mt-2 flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1";

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
      <p className={`${rowClasses} text-xs text-secondaryText`}>
        Same as {comparisonLabel}
      </p>
    );
  }

  const isUp = change > 0;
  const isGood = isUp === higherIsBetter;
  const tone = isGood ? "bg-success/10 text-success" : "bg-danger/10 text-danger";
  const Arrow = isUp ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div className={rowClasses}>
      <span
        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${tone}`}
      >
        <Arrow className="size-3.5" />
        {formattedChange}
      </span>
      <span className="text-xs text-secondaryText">vs {comparisonLabel}</span>
    </div>
  );
}

export default StatTrend;
