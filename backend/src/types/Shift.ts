import { StudentAssigned, StudentRequesting } from "./Student.js";

export type ShiftType = "morning" | "middle" | "afternoon";

export type Shift = {
  id: number;
  date: string; // Format: YYYY-MM-DD
  shift_type: ShiftType;
  scheduled_start_time: string;
  scheduled_end_time: string;
};

export type AssignedShiftToUser = {
  assigned_shift_id: number;
  date: string; // Format: tiemestampz
  shift_type: ShiftType;
  scheduled_start_time: string; // Format: timestampz
  scheduled_end_time: string; // Format: timestampz
  actual_start_time: string | null; // Format: timestampz
  actual_end_time: string | null; // Format: timestampz
  requested_at: string | null; // Format: timestampz
  hourly_rate: number;
};

export type SingleShiftRowToAggregate = {
  shift_id: number;
  date: string; // Format: YYYY-MM-DD
  shift_type: ShiftType;
  scheduled_start_time: string;
  scheduled_end_time: string;
  user_id: number | null;
  first_name: string | null;
  last_name: string | null;
};

export type ShiftWithStudentsAndRequesters = {
  shift_id: number;
  date: string; // Format: YYYY-MM-DD
  shift_type: ShiftType;
  scheduled_start_time: string;
  scheduled_end_time: string;
  students_assigned: StudentAssigned[];

  students_requesting: StudentRequesting[];
};

export type AggregatedShiftWithStudents = {
  id: number;
  date: string; // Format: YYYY-MM-DD
  shift_type: ShiftType;
  scheduled_start_time: string;
  scheduled_end_time: string;
  students: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
};

export type UserStats = {
  totalShifts: number;
  totalHours: number;
  totalEarnings: number;
  averageMonth: AverageMonthStats;
  acceptance: AcceptanceStats;
  attendance: AttendanceStats;
  byShiftTypes: StatsByShiftType[];
  byWeekDay: StatsByWeekDay[];
  byMonth: Record<string, MonthStats[]>;
};

export type MonthStats = {
  month: string;
  monthNumber: number; // 1-12
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
