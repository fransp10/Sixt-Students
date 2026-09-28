import { CheckCircleIcon } from "@heroicons/react/24/outline";
import type { ShiftWithStudentsAndRequesters } from "../../../types/Shift";
import { getInitials } from "../../../helpers/helpers";
import { MAX_VISIBLE_STUDENTS } from "../../../config/maxStudents";

function CurrentlyActiveShiftCell({
  onClick,
  shift,
}: {
  onClick: () => void;
  shift: ShiftWithStudentsAndRequesters;
}) {
  const studentsToDisplay = shift.students_assigned.slice(
    0,
    MAX_VISIBLE_STUDENTS,
  );

  const leftOverStudents =
    shift.students_assigned.length - MAX_VISIBLE_STUDENTS;

  return (
    <td className="h-36 border border-primary/30 border-l-4 border-l-primary bg-primary/15 hover:bg-primary/20 transition-colors duration-200 p-3">
      <button
        onClick={onClick}
        className="flex h-full w-full flex-col gap-2 text-left cursor-pointer"
      >
        <div className="flex items-center gap-1.5 text-primary">
          <CheckCircleIcon className="size-4 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Current shift
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs  text-secondaryText">
            Working students: {shift.students_assigned.length}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {studentsToDisplay.map((student) => (
              <span
                key={student.id}
                className="bg-surfaceCards text-xs font-bold text-secondaryText rounded-full size-8 flex items-center justify-center"
              >
                {getInitials(student.first_name.concat(" ", student.last_name))}
              </span>
            ))}
          </div>
          {leftOverStudents > 0 && (
            <span className="flex items-center text-xs text-primaryText">
              +{leftOverStudents} others
            </span>
          )}
        </div>
      </button>
    </td>
  );
}

export default CurrentlyActiveShiftCell;
