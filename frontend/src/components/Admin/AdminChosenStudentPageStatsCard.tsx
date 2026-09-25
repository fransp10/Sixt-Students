import type { ComponentType, SVGProps } from "react";

type AdminChosenStudentPageStatsCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  statName: string;
  statValue: string | number;
  previousValue: string | number;
  prefix?: string;
  suffix?: string;
};
function AdminChosenStudentPageStatsCard({
  icon: Icon,
  statName,
  statValue,
  previousValue,
  prefix,
  suffix,
}: AdminChosenStudentPageStatsCardProps) {
  const difference = Number(
    (Number(statValue) - Number(previousValue)).toFixed(0),
  );

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-borderDividers bg-studentCard p-4">
      <Icon className="size-10 shrink-0 rounded-full bg-darkBackground p-2 text-secondaryText" />

      <div className="min-w-0">
        <p className="text-sm text-primaryText">{statName}</p>

        <p className="mt-1 text-2xl font-medium text-primary">{`${prefix ? prefix : ""}${statValue}${suffix ? suffix : ""}`}</p>

        <p
          className={`mt-1 whitespace-nowrap text-xs ${
            difference >= 0 ? "text-success" : "text-danger"
          }`}
        >
          {difference > 0 && "+"}
          {prefix ? prefix : ""}
          {difference}
          {suffix ? suffix : ""} vs last month
        </p>
      </div>
    </div>
  );
}
export default AdminChosenStudentPageStatsCard;
