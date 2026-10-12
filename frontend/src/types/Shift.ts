import type { StudentAssigned, StudentRequesting } from "./students";

export type ShiftType = "morning" | "middle" | "afternoon";

export type ShiftStatus =
  | "passed"
  | "requested"
  | "assigned"
  | "ongoing"
  | "available";

export type StudentShort = {
  id: number;
  name: string;
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

export type ShiftsWorkedHistoryData = {
  assigned_shift_id: number;
  date: string; // Format: tiemestampz
  shift_type: ShiftType;
  scheduled_start_time: string; // Format: timestampz
  scheduled_end_time: string; // Format: timestampz
  actual_start_time: string | null; // Format: timestampz
  actual_end_time: string | null; // Format: timestampz
  requested_at: string | null; // Format: timestampz
  hourly_rate: number;
  hours_worked: number;
  no_show: boolean;
};
