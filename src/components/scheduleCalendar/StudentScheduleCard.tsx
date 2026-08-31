import type { ComponentType, SVGProps } from "react";

type StudentScheduleCardProps = {
  name: string;
  initials: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  onAction?: () => void;
};

function StudentScheduleCard({
  name,
  initials,
  icon: Icon,
  onAction,
}: StudentScheduleCardProps) {
  return (
    <div className="flex gap-4 items-center p-2  h-22 bg-studentCard border rounded-xl border-borderDividers ">
      <span className="text-xl font-bold size-12 rounded-full text-center bg-primary p-2">
        {initials}
      </span>
      <span className="text-xl">{name}</span>
      <button className="ml-auto mr-2 border border-borderDividers rounded-xl p-4 hover:cursor-pointer hover:bg-red-600 hover:text-primaryText text-red-600 transition-all duration-300">
        <Icon className="size-6 " />
      </button>
    </div>
  );
}

export default StudentScheduleCard;
