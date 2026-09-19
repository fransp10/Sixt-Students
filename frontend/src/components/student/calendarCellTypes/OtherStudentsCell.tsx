import { UserGroupIcon } from "@heroicons/react/24/solid";
import { getAvatarColor, getInitials } from "../../../helpers/helpers";
import type {
  StudentAssigned,
  StudentRequesting,
} from "../../../types/students";
import { MAX_VISIBLE_STUDENTS } from "../../../config/maxStudents";

function OtherStudentsCell({
  students,
  label,
  onClick,
}: {
  students: StudentAssigned[] | StudentRequesting[];
  label: string;
  onClick: () => void;
}) {
  const studentsToShow = students.slice(0, MAX_VISIBLE_STUDENTS);
  const leftOverStudents = students.length - MAX_VISIBLE_STUDENTS;

  return (
    <td
      className={`h-36 z-100 text-left text-primaryText border border-borderDividers bg-cardLighterBG hover:bg-surfaceCards/30 transition-colors duration-200 `}
    >
      <button
        className={`flex h-full w-full flex-col gap-4 p-4 text-left  "cursor-pointer"`}
        onClick={onClick}
      >
        <div className="flex items-center gap-1.5 text-secondaryText">
          <UserGroupIcon className="size-4 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className="flex flex-wrap h-full gap-1.5   ">
          {studentsToShow.map((student) => (
            <span
              key={student.id}
              title={student.first_name.concat(" ", student.last_name)}
              className={`${getAvatarColor(student.id)}  text-xs font-semibold text-white rounded-full size-8 flex items-center justify-center opacity-80`}
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

export default OtherStudentsCell;
