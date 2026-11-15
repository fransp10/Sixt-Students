import type { ShiftType } from "../types/Shift";

export const SHIFT_TYPES: ShiftType[] = ["morning", "middle", "afternoon"];

// Hours of the working day the calendar covers, used to draw each shift's span.
export const DAY_START_HOUR = 7;
export const DAY_END_HOUR = 22;

export const SHIFT_HOURS: Record<ShiftType, { start: number; end: number }> = {
  morning: { start: 7, end: 15 },
  middle: { start: 10, end: 18 },
  afternoon: { start: 14, end: 22 },
};

export function formatShiftRange(shiftType: ShiftType) {
  const { start, end } = SHIFT_HOURS[shiftType];
  const pad = (hour: number) => String(hour).padStart(2, "0");
  return `${pad(start)}:00 - ${pad(end)}:00`;
}

export function getShiftSpan(shiftType: ShiftType) {
  const { start, end } = SHIFT_HOURS[shiftType];
  const total = DAY_END_HOUR - DAY_START_HOUR;
  return {
    left: ((start - DAY_START_HOUR) / total) * 100,
    width: ((end - start) / total) * 100,
  };
}
