import type {
  ShiftStatus,
  ShiftWithStudentsAndRequesters,
} from "../types/Shift";

export function getShiftStatus(
  shift: ShiftWithStudentsAndRequesters,
  userId: number,
): ShiftStatus {
  const dateNow = new Date();
  const currentHours = dateNow.getHours();
  const currentMinutes = dateNow.getMinutes();
  const currentDate = new Date().toISOString().split("T")[0];
  const shiftDate = new Date(shift.date).toISOString().split("T")[0];

  const [shiftStartHours, shiftStartMinutes] = shift.scheduled_start_time
    .split(":")
    .map((time) => Number(time));

  const [shiftEndHours, shiftEndMinutes] = shift.scheduled_end_time
    .split(":")
    .map((time) => Number(time));

  const now = currentHours * 60 + currentMinutes;
  const start = shiftStartHours * 60 + shiftStartMinutes;
  const end = shiftEndHours * 60 + shiftEndMinutes;
  const isStudentAssigned =
    shift.students_assigned.length > 0 &&
    shift.students_assigned.some((student) => student.id === userId);
  const isStudentRequesting =
    shift.students_requesting.length > 0 &&
    shift.students_requesting.some((student) => student.id === userId);

  if (shiftDate < currentDate) return "passed";

  if (isStudentAssigned) return "assigned";
  if (isStudentRequesting) return "requested";

  if (shiftDate > currentDate) return "available";
  if (now < start) {
    return "available";
  }

  if (now < end) {
    return "ongoing";
  }

  return "passed";
}
