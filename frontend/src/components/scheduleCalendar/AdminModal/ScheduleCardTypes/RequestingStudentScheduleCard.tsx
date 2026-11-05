import { PlusIcon } from "@heroicons/react/24/outline";
import { getAvatarColor, getInitials } from "../../../../helpers/helpers";
import type { StudentRequesting } from "../../../../types/students";
import { format } from "date-fns";

function RequestingStudentScheduleCard({
  student,
  onClick,
}: {
  student: StudentRequesting;
  onClick?: (studentId: number) => void;
}) {
  const studentName = `${student.first_name} ${student.last_name}`;
  return (
    <div className="flex gap-4 items-center p-2 bg-studentCard border rounded-xl border-borderDividers">
      <span
        className={`${getAvatarColor(student.id)} text-base font-semibold size-10 rounded-full flex items-center justify-center text-white `}
      >
        {getInitials(studentName)}
      </span>
      <div className="flex min-w-0 lg:min-w-auto flex-col">
        <span className="text-base lg:text-lg truncate">{studentName}</span>
        <span className="text-xs text-secondaryText">
          {format(student.requested_at, "MMM dd, yyyy 'at' hh:mm a")}
        </span>
      </div>

      <button
        onClick={() => {
          if (onClick) onClick(student.id);
        }}
        className={`ml-auto mr-2 border border-borderDividers rounded-xl p-3 lg:p-2 hover:cursor-pointer transition-all duration-300 text-success hover:bg-success hover:text-primaryText`}
      >
        <PlusIcon className="size-5" />
      </button>
    </div>
  );
}

export default RequestingStudentScheduleCard;
