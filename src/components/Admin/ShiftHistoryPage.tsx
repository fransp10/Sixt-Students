import ShiftHistoryMobileCard from "../ShiftHistoryMobileCard";
import ShiftHistoryTable from "../ShiftHistoryTable";

export type StudentShiftHistory = {
  id: string;
  date: string;
  shiftType: "Morning" | "Middle" | "Afternoon";
  startTime: string;
  endTime: string;
  hours: number;
};

export type ShiftHistoryPageProps = {
  shifts: StudentShiftHistory[];
};
const shiftHistory: StudentShiftHistory[] = [
  {
    id: "1",
    date: "2026-09-02",
    shiftType: "Morning",
    startTime: "07:00",
    endTime: "15:00",
    hours: 8,
  },
  {
    id: "2",
    date: "2026-08-30",
    shiftType: "Afternoon",
    startTime: "14:00",
    endTime: "22:00",
    hours: 8,
  },
  {
    id: "3",
    date: "2026-08-28",
    shiftType: "Middle",
    startTime: "10:00",
    endTime: "18:00",
    hours: 8,
  },
  {
    id: "4",
    date: "2026-08-25",
    shiftType: "Morning",
    startTime: "07:00",
    endTime: "15:00",
    hours: 8,
  },
  {
    id: "5",
    date: "2026-08-23",
    shiftType: "Afternoon",
    startTime: "14:00",
    endTime: "22:00",
    hours: 8,
  },
  {
    id: "6",
    date: "2026-08-23",
    shiftType: "Afternoon",
    startTime: "14:00",
    endTime: "22:00",
    hours: 8,
  },
  {
    id: "8",
    date: "2026-08-23",
    shiftType: "Afternoon",
    startTime: "14:00",
    endTime: "22:00",
    hours: 8,
  },
  {
    id: "9",
    date: "2026-08-23",
    shiftType: "Afternoon",
    startTime: "14:00",
    endTime: "22:00",
    hours: 8,
  },
];

function ShiftHistoryPage({ shifts }: ShiftHistoryPageProps) {
  return (
    <>
      {/* Mobile */}
      <ShiftHistoryMobileCard shifts={shiftHistory} />
      {/* PC */}
      <ShiftHistoryTable shifts={shiftHistory} />
    </>
  );
}

export default ShiftHistoryPage;
