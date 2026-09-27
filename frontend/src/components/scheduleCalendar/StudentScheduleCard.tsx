import type { ComponentType, SVGProps } from "react";
import { getAvatarColor, getInitials } from "../../helpers/helpers";

type StudentScheduleCardProps = {
  studentId: number;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  variant: "assigned" | "requesting";
  onClick?: (studentId: number) => void;
};

function StudentScheduleCard({
  studentId,
  name,
  icon: Icon,
  variant,
  onClick,
}: StudentScheduleCardProps) {
  const actionButtonClasses =
    variant === "assigned"
      ? "text-danger hover:bg-danger hover:text-primaryText"
      : "text-success hover:bg-success hover:text-primaryText";

  return (
    <div className="flex gap-4 items-center p-2 h-22 bg-studentCard border rounded-xl border-borderDividers">
      <span
        className={`${getAvatarColor(studentId)} text-lg font-semibold size-12 rounded-full flex items-center justify-center text-white shrink-0`}
      >
        {getInitials(name)}
      </span>
      <span className="text-xl truncate">{name}</span>
      <button
        onClick={() => {
          if (onClick) onClick(studentId);
        }}
        className={`ml-auto mr-2 border border-borderDividers rounded-xl p-4 hover:cursor-pointer transition-all duration-300 ${actionButtonClasses}`}
      >
        <Icon className="size-6" />
      </button>
    </div>
  );
}

export default StudentScheduleCard;
