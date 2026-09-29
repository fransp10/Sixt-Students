import { format, isBefore, parseISO } from "date-fns";
import type { ShiftWithStudentsAndRequesters } from "../types/Shift";

export type ShiftTiming = "upcoming" | "active" | "ended";

export function getShiftTiming(
  shift: ShiftWithStudentsAndRequesters,
): ShiftTiming {
  const day = format(new Date(shift.date), "yyyy-MM-dd");
  const start = parseISO(`${day}T${shift.scheduled_start_time}`);
  const end = parseISO(`${day}T${shift.scheduled_end_time}`);
  const now = new Date();

  if (isBefore(now, start)) return "upcoming";
  if (isBefore(now, end)) return "active";
  return "ended";
}
