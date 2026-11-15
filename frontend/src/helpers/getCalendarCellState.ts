import { format, isAfter, isBefore, parseISO } from "date-fns";
import type { ShiftWithStudentsAndRequesters } from "../types/Shift";
import type { StudentAssigned, StudentRequesting } from "../types/students";

export type CalendarCellState =
  | { kind: "passed"; students: [] }
  | { kind: "active"; students: StudentAssigned[] }
  | { kind: "assigned"; students: StudentAssigned[] }
  | { kind: "requested"; students: StudentRequesting[] }
  | { kind: "others"; students: StudentAssigned[] | StudentRequesting[] }
  | { kind: "empty"; students: [] };

export type CalendarCellKind = CalendarCellState["kind"];

export function getCalendarCellState(
  shift: ShiftWithStudentsAndRequesters,
  currentUserId: number | undefined,
): CalendarCellState {
  const now = new Date();
  const shiftDate = format(new Date(shift.date), "yyyy-MM-dd");
  const shiftEnd = parseISO(`${shiftDate}T${shift.scheduled_end_time}`);
  const shiftStart = parseISO(`${shiftDate}T${shift.scheduled_start_time}`);

  if (isBefore(shiftEnd, now)) return { kind: "passed", students: [] };

  if (isAfter(now, shiftStart) && isBefore(now, shiftEnd)) {
    return { kind: "active", students: shift.students_assigned };
  }

  if (shift.students_assigned.length > 0) {
    const isCurrentUserAssigned = shift.students_assigned.some(
      (student) => student.id === currentUserId,
    );
    return isCurrentUserAssigned
      ? { kind: "assigned", students: shift.students_assigned }
      : { kind: "others", students: shift.students_assigned };
  }

  if (shift.students_requesting.length > 0) {
    const isCurrentUserRequesting = shift.students_requesting.some(
      (student) => student.id === currentUserId,
    );
    return isCurrentUserRequesting
      ? { kind: "requested", students: shift.students_requesting }
      : { kind: "others", students: shift.students_requesting };
  }

  return { kind: "empty", students: [] };
}
