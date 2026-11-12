import {
  CloudIcon,
  MoonIcon,
  SunIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { CELL_THEME } from "../../config/calendarCellTheme";
import { formatShiftRange } from "../../config/shiftHours";
import { capitalize } from "../../helpers/capitalize";
import { getCalendarCellState } from "../../helpers/getCalendarCellState";
import { getInitials } from "../../helpers/helpers";
import { getShiftTiming } from "../../helpers/shiftTiming";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import type {
  ShiftType,
  ShiftWithStudentsAndRequesters,
} from "../../types/Shift";
import ShiftTimeRail from "./ShiftTimeRail";

const ICONS = { morning: SunIcon, middle: CloudIcon, afternoon: MoonIcon };
const MAX_LISTED_STUDENTS = 2;

function ShiftHeading({ shiftType }: { shiftType: ShiftType }) {
  const ShiftIcon = ICONS[shiftType];
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <ShiftIcon className="size-6" />
      </span>
      <div>
        <p className="text-lg font-semibold leading-tight">
          {capitalize(shiftType)}
        </p>
        <p className="text-sm tabular-nums text-secondaryText">
          {formatShiftRange(shiftType)}
        </p>
      </div>
    </div>
  );
}

function MobileShiftsCell({
  shiftType,
  shift,
  currentUserId,
  handleShiftClick,
}: {
  shiftType: ShiftType;
  shift?: ShiftWithStudentsAndRequesters;
  currentUserId: number | undefined;
  handleShiftClick: (shift?: ShiftWithStudentsAndRequesters) => void;
}) {
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.user_role === "admin";

  if (!shift) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-dashed border-surfaceCards p-4">
        <ShiftHeading shiftType={shiftType} />
        <ShiftTimeRail shiftType={shiftType} className="max-w-none" />
        <p className="text-sm text-secondaryText">No shift data</p>
      </div>
    );
  }

  const state = getCalendarCellState(shift, currentUserId);
  const theme = CELL_THEME[state.kind];
  const statusLabel =
    state.kind === "others" ? capitalize(getShiftTiming(shift)) : theme.label;
  const students = state.students;
  const studentsToList = students.slice(0, MAX_LISTED_STUDENTS);
  const remainingStudents = students.length - studentsToList.length;

  return (
    <button
      type="button"
      onClick={() => handleShiftClick(shift)}
      aria-label={`${format(new Date(shift.date), "EEEE d MMMM")}, ${capitalize(shiftType)} shift, ${statusLabel}`}
      className={`${theme.frame} flex w-full cursor-pointer flex-col gap-4 rounded-xl border bg-(--cell-bg) p-4 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
    >
      <div className="flex items-start justify-between gap-3">
        <ShiftHeading shiftType={shiftType} />
        {students.length > 0 && (
          <span
            title={`${students.length} students`}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-surfaceCards px-3 py-1.5 text-sm tabular-nums"
          >
            <UsersIcon className="size-4 text-secondaryText" />
            {students.length}
          </span>
        )}
      </div>
      <ShiftTimeRail shiftType={shiftType} className="max-w-none" />

      <div className="flex flex-col gap-0.5">
        {state.kind === "empty" ? (
          <>
            <span className="text-sm text-secondaryText">
              No requests or assignments
            </span>
            <span className="text-sm font-medium">Tap to sign up</span>
          </>
        ) : (
          <>
            <span
              className={`flex items-center gap-1.5 text-sm font-medium ${theme.text}`}
            >
              <theme.Icon className="size-4 shrink-0" />
              {statusLabel}
            </span>
            {state.kind === "requested" && (
              <span className="text-sm text-secondaryText">
                Waiting for approval
              </span>
            )}
            {state.kind === "passed" && isAdmin && (
              <span className="flex gap-4 text-sm">
                <span className="text-success/80">
                  Assigned: {shift.students_assigned.length}
                </span>
                <span className="text-pending/80">
                  Requested: {shift.students_requesting.length}
                </span>
              </span>
            )}
          </>
        )}
      </div>

      {studentsToList.length > 0 && (
        <ul className="flex flex-col gap-2">
          {studentsToList.map((student) => (
            <li key={student.id} className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-surfaceCards text-xs font-semibold text-primaryText">
                {getInitials(`${student.first_name} ${student.last_name}`)}
              </span>
              <span className="text-sm">{student.first_name}</span>
            </li>
          ))}
          {remainingStudents > 0 && (
            <li className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-surfaceCards text-xs font-semibold text-primaryText">
                +{remainingStudents}
              </span>
              <span className="text-sm text-secondaryText">more</span>
            </li>
          )}
        </ul>
      )}
    </button>
  );
}

export default MobileShiftsCell;
