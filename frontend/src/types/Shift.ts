import type { StudentAssigned, StudentRequesting } from "./students";

export type ShiftType = "morning" | "middle" | "afternoon";

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
