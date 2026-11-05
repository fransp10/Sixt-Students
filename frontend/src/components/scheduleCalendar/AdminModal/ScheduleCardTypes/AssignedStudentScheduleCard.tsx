import { TrashIcon } from "@heroicons/react/24/outline";
import { getAvatarColor, getInitials } from "../../../../helpers/helpers";
import type { StudentAssigned } from "../../../../types/students";

type AssignedStudentScheduleCardProps = {
  student: StudentAssigned;
  scheduledStart: string;
  scheduledEnd: string;
  onClick?: (studentId: number) => void;
  shiftId: number;
};

function AssignedStudentScheduleCard({
  student,
  onClick,
}: AssignedStudentScheduleCardProps) {
  return (
    <div className="flex flex-row justify-between gap-3 p-3 bg-studentCard border rounded-xl border-borderDividers">
      <div className="flex min-w-0 gap-3 items-center">
        <span
          className={`${getAvatarColor(student.id)} text-base font-semibold size-10 rounded-full flex items-center justify-center text-white shrink-0`}
        >
          {getInitials(student.first_name + " " + student.last_name)}
        </span>
        <span className="text-base lg:text-lg">
          {student.first_name + " " + student.last_name}
        </span>
      </div>

      <button
        onClick={() => {
          if (onClick) onClick(student.id);
        }}
        aria-label={`Remove ${student.first_name} from this shift`}
        className="shrink-0 border border-borderDividers rounded-lg p-3 lg:p-2 hover:cursor-pointer transition-all duration-300 text-danger hover:bg-danger hover:text-primaryText"
      >
        <TrashIcon className="size-5" />
      </button>
    </div>
  );
}

export default AssignedStudentScheduleCard;
