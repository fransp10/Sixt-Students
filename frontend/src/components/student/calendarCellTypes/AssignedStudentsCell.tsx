import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { getAvatarColor, getInitials } from "../../../helpers/helpers";
import type { StudentAssigned } from "../../../types/students";
import { MAX_VISIBLE_STUDENTS } from "../../../config/maxStudents";

function AssignedStudentsCell({
  onClick,
  students,
}: {
  onClick: () => void;
  students: StudentAssigned[];
}) {
  const studentsToShow = students.slice(0, MAX_VISIBLE_STUDENTS);
  const leftOverStudents = students.length - MAX_VISIBLE_STUDENTS;

  return (
    <td className="h-36 border border-success/30 border-l-4 border-l-success bg-success/15 hover:bg-success/20 transition-colors duration-200 p-3">
      <button
        onClick={onClick}
        className="flex h-full w-full flex-col gap-2 text-left cursor-pointer"
      >
        <div className="flex items-center gap-1.5 text-success">
          <CheckCircleIcon className="size-4 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Assigned
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

export default AssignedStudentsCell;
