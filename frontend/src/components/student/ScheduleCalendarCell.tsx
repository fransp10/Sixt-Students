import { format } from "date-fns";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import AssignedStudentsCell from "./calendarCellTypes/AssignedStudentsCell";
import RequestingStudentsCell from "./calendarCellTypes/RequestingStudentsCell";
import OtherStudentsCell from "./calendarCellTypes/OtherStudentsCell";
import EmptyCell from "./calendarCellTypes/EmptyCell";
import ShiftPassedCell from "./calendarCellTypes/ShiftPassedCell";
import CurrentlyActiveShiftCell from "./calendarCellTypes/CurrentlyActiveShiftCell";
import { getShiftTiming } from "../../helpers/shiftTiming";
import { getCalendarCellState } from "../../helpers/getCalendarCellState";
import { capitalize } from "../../helpers/capitalize";

type StudentsScheduleCalendarCellProps = {
  onClick: () => void;
  shift: ShiftWithStudentsAndRequesters | undefined;
  currentUserId: number | undefined;
};

function ScheduleCalendarCell({
  shift,
  onClick,
  currentUserId,
}: StudentsScheduleCalendarCellProps) {
  if (!shift) {
    return (
      <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-borderDividers p-3 text-center text-xs text-secondaryText">
        No shift data
      </div>
    );
  }

  const state = getCalendarCellState(shift, currentUserId);
  const ariaLabel = `${format(new Date(shift.date), "EEEE d MMMM")}, ${capitalize(shift.shift_type)} shift`;

  switch (state.kind) {
    case "passed":
      return (
        <ShiftPassedCell onClick={onClick} shift={shift} ariaLabel={ariaLabel} />
      );
    case "active":
      return (
        <CurrentlyActiveShiftCell
          onClick={onClick}
          shift={shift}
          ariaLabel={ariaLabel}
        />
      );
    case "assigned":
      return (
        <AssignedStudentsCell
          students={state.students}
          onClick={onClick}
          ariaLabel={ariaLabel}
        />
      );
    case "requested":
      return (
        <RequestingStudentsCell
          students={state.students}
          onClick={onClick}
          ariaLabel={ariaLabel}
        />
      );
    case "others":
      return (
        <OtherStudentsCell
          students={state.students}
          label={getShiftTiming(shift)}
          onClick={onClick}
          ariaLabel={ariaLabel}
        />
      );
    case "empty":
      return <EmptyCell onClick={onClick} ariaLabel={ariaLabel} />;
  }
}

export default ScheduleCalendarCell;
