import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import AssignedStudentsCell from "./calendarCellTypes/AssignedStudentsCell";
import RequestingStudentsCell from "./calendarCellTypes/RequestingStudentsCell";
import OtherStudentsCell from "./calendarCellTypes/OtherStudentsCell";
import EmptyCell from "./calendarCellTypes/EmptyCell";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import ShiftPassedCell from "./calendarCellTypes/ShiftPassedCell";
import CurrentlyActiveShiftCell from "./calendarCellTypes/CurrentlyActiveShiftCell";

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
      <td className="h-36 border border-borderDividers text-center uppercase text-xs text-secondaryText">
        No Shift data
      </td>
    );
  }

  const now = new Date();

  const shiftDate = format(new Date(shift.date), "yyyy-MM-dd");

  const shiftEnd = parseISO(`${shiftDate}T${shift.scheduled_end_time}`);
  const shiftStart = parseISO(`${shiftDate}T${shift.scheduled_start_time}`);

  if (isBefore(shiftEnd, now)) {
    return <ShiftPassedCell onClick={onClick} shift={shift} />;
  }
  if (isAfter(now, shiftStart) && isBefore(now, shiftEnd)) {
    return <CurrentlyActiveShiftCell onClick={onClick} shift={shift} />;
  }
  if (shift?.students_assigned.length > 0) {
    const isCurrentUserAssigned = shift.students_assigned.some(
      (student) => student.id === currentUserId,
    );

    if (!isCurrentUserAssigned) {
      return (
        <OtherStudentsCell
          students={shift.students_assigned}
          label="Assigned"
          onClick={onClick}
        />
      );
    }

    return (
      <AssignedStudentsCell
        students={shift.students_assigned}
        onClick={onClick}
      />
    );
  } else if (shift?.students_requesting.length > 0) {
    const isCurrentUserRequesting = shift.students_requesting.some(
      (student) => student.id === currentUserId,
    );

    if (!isCurrentUserRequesting) {
      return (
        <OtherStudentsCell
          students={shift.students_requesting}
          label="Requested"
          onClick={onClick}
        />
      );
    }

    return (
      <RequestingStudentsCell
        students={shift.students_requesting}
        onClick={onClick}
      />
    );
  }
  return <EmptyCell onClick={onClick} />;
}

export default ScheduleCalendarCell;
