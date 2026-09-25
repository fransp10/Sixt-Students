import type { ShiftType } from "./Shift";

export type UserStats = {
  totalShifts: number;
  totalHours: number;
  totalEarnings: number;
  acceptance: AcceptanceStats;
  byShiftTypes: StatsByShiftType[];
  byWeekday: StatsByWeekDay[];
  byMonth: Record<string, MonthStats[]>;
};

export type MonthStats = {
  month: string;
  count: number;
  hours: number;
  earnings: number;
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
