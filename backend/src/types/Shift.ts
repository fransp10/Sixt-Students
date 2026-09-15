export type ShiftTypes = {
  id: number;
  shift_name: string;
  start_time: string;
  end_time: string;
};

export type Shift = {
  id: number;
  date: string;
  shift_type: ShiftTypes;
  scheduled_start_time: string;
  scheduled_end_time: string;
};
