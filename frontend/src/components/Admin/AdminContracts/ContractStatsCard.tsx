import type { ContractStatsCardProps } from "../../../types/contractStatsCard";

function ContractStatsCard({
  title,
  value,
  icon: Icon,
  total,
  progress,
  valueClassName = "text-primaryText",
  className = "",
}: ContractStatsCardProps) {
  return (
    <div
      className={`rounded-xl border border-borderDividers bg-cardBG p-5 transition-colors hover:border-primary/40 ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <p className="truncate text-sm font-medium text-secondaryText">
          {title}
        </p>
      </div>

      <p
        className={`mt-5 text-3xl font-semibold tabular-nums ${valueClassName}`}
      >
        {value}
        {total && (
          <span className={`text-base font-normal text-secondaryText `}>
            / {total}
          </span>
        )}
      </p>

      {progress !== undefined && (
        <div className="mt-3 h-1 rounded-full bg-darkBackground">
          <div
            className={`h-1 rounded-full ${progress >= 100 ? "bg-success" : "bg-primary"}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default ContractStatsCard;
