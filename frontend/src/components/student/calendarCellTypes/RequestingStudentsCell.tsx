import { ClockIcon } from "@heroicons/react/24/solid";
import { getAvatarColor, getInitials } from "../../../helpers/helpers";
import type { StudentRequesting } from "../../../types/students";
import { MAX_VISIBLE_STUDENTS } from "../../../config/maxStudents";

function RequestingStudentsCell({
  students,
  onClick,
}: {
  students: StudentRequesting[];
  onClick: () => void;
}) {
  const studentsToShow = students.slice(0, MAX_VISIBLE_STUDENTS);
  const leftOverStudents = students.length - MAX_VISIBLE_STUDENTS;

  return (
    <td className="h-36 border border-pending/30 border-l-4 border-l-pending bg-pending/15 hover:bg-pending/20 transition-colors duration-200 p-3">
      <button
        onClick={onClick}
        className="flex h-full w-full flex-col gap-2 text-left cursor-pointer"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-pending">
            <ClockIcon className="size-4 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Requested
            </span>
          </div>
          <span className="text-[11px] text-secondaryText">
            Waiting for approval
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {studentsToShow.map((student) => (
            <span
              key={student.id}
              title={student.first_name.concat(" ", student.last_name)}
              className={`${getAvatarColor(student.id)} text-xs font-semibold text-white rounded-full size-8 flex items-center justify-center`}
            >
              {getInitials(student.first_name.concat(" ", student.last_name))}
            </span>
          ))}
          {leftOverStudents > 0 && (
            <span className="bg-surfaceCards text-xs font-semibold text-secondaryText rounded-full size-8 flex items-center justify-center">
              +{leftOverStudents}
            </span>
          )}
        </div>
      </button>
    </td>
  );
}

export default RequestingStudentsCell;
