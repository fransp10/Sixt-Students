import type { ShiftType } from "./Shift";

export type UserStats = {
  totalShifts: number;
  averageMonth: AverageMonthStats;
  totalHours: number;
  totalEarnings: number;
  acceptance: AcceptanceStats;
  attendance: AttendanceStats;
  byShiftTypes: StatsByShiftType[];
  byWeekday: StatsByWeekDay[];
  byMonth: MonthStats[]; // oldest month first
};

export type MonthStats = {
  month: string; // "yyyy-MM", e.g. "2026-05"
  count: number;
  hours: number;
  earnings: number;
  attendanceRate: number;
  assigned: number;
  noShows: number;
};

export type AverageMonthStats = {
  count: number;
  hours: number;
  earnings: number;
  attendanceRate: number;
};

export type AttendanceStats = {
  total: number;
  noShows: number;
  rate: number;
};
export type StatsByShiftType = {
  shift_name: ShiftType;
  count: number;
  hours: number;
  earnings: number;
};

export type StatsByWeekDay = {
  day: string;
  count: number;
  hours: number;
  earnings: number;
};

export type AcceptanceStats = {
  requested: number;
  assigned: number;
  rate: number;
};
