import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import AssignedStudentsCell from "./calendarCellTypes/AssignedStudentsCell";
import RequestingStudentsCell from "./calendarCellTypes/RequestingStudentsCell";
import OtherStudentsCell from "./calendarCellTypes/OtherStudentsCell";
import EmptyCell from "./calendarCellTypes/EmptyCell";
import ShiftPassedCell from "./calendarCellTypes/ShiftPassedCell";
import CurrentlyActiveShiftCell from "./calendarCellTypes/CurrentlyActiveShiftCell";
import { getShiftTiming } from "../../helpers/shiftTiming";
import { getCalendarCellState } from "../../helpers/getCalendarCellState";

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

  switch (state.kind) {
    case "passed":
      return <ShiftPassedCell onClick={onClick} shift={shift} />;
    case "active":
      return <CurrentlyActiveShiftCell onClick={onClick} shift={shift} />;
    case "assigned":
      return (
        <AssignedStudentsCell students={state.students} onClick={onClick} />
      );
    case "requested":
      return (
        <RequestingStudentsCell students={state.students} onClick={onClick} />
      );
    case "others":
      return (
        <OtherStudentsCell
          students={state.students}
          label={getShiftTiming(shift)}
          onClick={onClick}
        />
      );
    case "empty":
      return <EmptyCell onClick={onClick} />;
  }
}

export default ScheduleCalendarCell;
