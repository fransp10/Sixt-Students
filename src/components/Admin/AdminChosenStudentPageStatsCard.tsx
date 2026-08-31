import type { ComponentType, SVGProps } from "react";

type AdminChosenStudentPageStatsCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  statName: string;
  statValue: string | number;
  lastMonthValue: string | number;
};
function AdminChosenStudentPageStatsCard({
  icon: Icon,
  statName,
  statValue,
  lastMonthValue,
}: AdminChosenStudentPageStatsCardProps) {
  return (
    <div className="flex flex-col items-center bg-studentCard gap-4 px-4 py-8 justify-center rounded-lg border border-borderDividers">
      <Icon className="size-14 bg-darkBackground rounded-full p-3 text-secondaryText" />
      <span className="text-lg ">{statName}</span>
      <span className="text-4xl text-primary">{statValue}</span>
      <span className="text-nowrap text-md text-success">
        +{lastMonthValue} vs last month
      </span>
    </div>
  );
}

export default AdminChosenStudentPageStatsCard;
