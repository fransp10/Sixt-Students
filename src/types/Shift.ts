export type ShiftType = "morning" | "middle" | "afternoon";

export type StudentShort = {
  id: number;
  name: string;
};

export type Shift = {
  id: number;
  date: string;
  type: ShiftType;
  students: StudentShort[];
};
