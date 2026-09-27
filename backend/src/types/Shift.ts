export type ShiftTypes = "morning" | "afternoon" | "night";
export type Shift = {
  id: number;
  date: string;
  shift_type: ShiftTypes;
  scheduled_start_time: string;
  scheduled_end_time: string;
};
