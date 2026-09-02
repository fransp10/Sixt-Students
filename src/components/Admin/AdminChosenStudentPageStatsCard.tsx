import type { ComponentType, SVGProps } from "react";

type AdminChosenStudentPageStatsCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  statName: string;
  statValue: string | number;
  previousValue: string | number;
};
function AdminChosenStudentPageStatsCard({
  icon: Icon,
  statName,
  statValue,
  previousValue,
}: AdminChosenStudentPageStatsCardProps) {
  const difference = Number(statValue) - Number(previousValue);
  return (
    <div className="flex flex-row items-center bg-studentCard gap-4 p-8 sm:p-4 md:pl-4 pl-8  rounded-lg border  border-borderDividers shrink-0 ">
      <Icon className="size-14 shrink-0  bg-darkBackground rounded-full p-3 text-secondaryText" />
      <div className="flex flex-col gap-1 ">
        <span className="text-lg ">{statName}</span>
        <span className="text-4xl text-primary">{statValue}</span>
        <span className="text-nowrap text-md text-success">
          {difference} vs last month
        </span>
      </div>
    </div>
  );
}

export default AdminChosenStudentPageStatsCard;
