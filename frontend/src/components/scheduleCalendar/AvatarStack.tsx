import { CELL_THEME } from "../../config/calendarCellTheme";
import { MAX_VISIBLE_STUDENTS } from "../../config/maxStudents";
import type { CalendarCellKind } from "../../helpers/getCalendarCellState";
import { getAvatarColor, getInitials } from "../../helpers/helpers";
import type { StudentAssigned, StudentRequesting } from "../../types/students";

type AvatarStackProps = {
  students: StudentAssigned[] | StudentRequesting[];
  // the kind of cell the stack sits in, so the rings match its background
  kind: CalendarCellKind;
  size?: "sm" | "md";
  // grey avatars, for cells that already carry a strong colour
  neutral?: boolean;
  max?: number;
};

const SIZES = {
  sm: "size-7 text-[11px] -ml-2 first:ml-0",
  md: "size-9 text-xs -ml-2.5 first:ml-0",
};

function AvatarStack({
  students,
  kind,
  size = "sm",
  neutral = false,
  max = MAX_VISIBLE_STUDENTS,
}: AvatarStackProps) {
  const studentsToShow = students.slice(0, max);
  const leftOverStudents = students.length - studentsToShow.length;
  const ring = `ring-2 ${CELL_THEME[kind].ring}`;

  return (
    <div className="flex items-center">
      {studentsToShow.map((student) => {
        const fullName = student.first_name.concat(" ", student.last_name);
        return (
          <span
            key={student.id}
            title={fullName}
            className={`${SIZES[size]} ${ring} flex shrink-0 items-center justify-center rounded-full font-semibold ${
              neutral
                ? "bg-surfaceCards text-secondaryText"
                : `${getAvatarColor(student.id)} text-white`
            }`}
          >
            {getInitials(fullName)}
          </span>
        );
      })}
      {leftOverStudents > 0 && (
        <span
          className={`${SIZES[size]} ${ring} flex shrink-0 items-center justify-center rounded-full bg-surfaceCards font-semibold text-primaryText`}
        >
          +{leftOverStudents}
        </span>
      )}
    </div>
  );
}

export default AvatarStack;
