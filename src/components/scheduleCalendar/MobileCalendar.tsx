import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  subDays,
} from "date-fns";
import MobileShiftsCell from "./MobileShiftsCell";
import type { Shift } from "../../types/Shift";
import { useState } from "react";
import StudentScheduleCalendarModal from "../student/StudentScheduleCalendarModal";

type MobileCalendarProps = {
  calendarType: "admin" | "student";
  onSwitchDate: (newDate: Date) => void;
  selectedDate: Date;
};

type SelectedSlot = {
  date: string;
  shiftType: ShiftType;
  shift?: Shift;
};

const shifts: Shift[] = [
  {
    id: 1,
    date: "2026-09-09",
    type: "morning",
    students: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Mark Smith" },
      { id: 3, name: "Mark Smith" },
      { id: 4, name: "Mark Smith" },
    ],
  },
  {
    id: 2,
    date: "2026-09-09",
    type: "middle",
    students: [{ id: 3, name: "Anna Smith" }],
  },
];
type ShiftType = "morning" | "middle" | "afternoon";
const shiftTypes: ShiftType[] = ["morning", "middle", "afternoon"];
function MobileCalendar({
  calendarType,
  onSwitchDate,
  selectedDate,
}: MobileCalendarProps) {
  const [selectedShift, setSelectedShift] = useState<SelectedSlot | null>(null);
  function handleShiftClick(shiftType: ShiftType, shift?: Shift) {
    setSelectedShift({
      date: format(selectedDate, "yyyy-MM-dd"),
      shiftType,
      shift,
    });
  }

  function onClose() {
    setSelectedShift(null);
  }

  const weekToDisplay = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  });

  return (
    <div className="text-primaryText m-6 flex flex-col gap-4">
      {/* Date picker */}
      <div
        className={`flex gap-4 items-center  bg-cardLighterBG rounded-xl justify-around border border-borderDividers p-4 `}
      >
        <button
          className="p-2 bg-surfaceCards rounded-full"
          onClick={() => onSwitchDate(subDays(selectedDate, 1))}
        >
          <ChevronLeftIcon className="size-6" />
        </button>
        <div className="relative w-1/2">
          <p className=" text-center text-base sm:text-xl font-semibol   ">
            {format(selectedDate, "MMMM d ")}
          </p>
          {isSameDay(selectedDate, new Date()) && (
            <span className="absolute left-1/2 top-full mt-1 size-2 -translate-x-1/2 rounded-full bg-primary" />
          )}
        </div>
        <button
          className="p-2 bg-surfaceCards rounded-full"
          onClick={() => onSwitchDate(addDays(selectedDate, 1))}
        >
          <ChevronRightIcon className="size-6" />
        </button>
      </div>
      <div className=" justify-between bg-cardLighterBG rounded-xl border border-borderDividers p-4 hidden sm:flex  gap-4  w-full">
        {weekToDisplay.map((day) => (
          <button
            type="button"
            onClick={() => onSwitchDate(day)}
            className={` flex flex-col  sm:px-4   justify-center items-center px-4 py-2
          ${isSameDay(selectedDate, day) ? "border border-primary rounded-xl" : "border border-transparent"}`}
            key={format(day, "yyyy-MM-dd")}
          >
            <p className="text-xs text-secondaryText">{format(day, "E")}</p>
            <p className="text-sm">{format(day, "d")}</p>
          </button>
        ))}
      </div>
      {/*  */}
      <div className="flex flex-col gap-4">
        {shiftTypes.map((shiftType) => {
          const shift = shifts.find(
            (shift) =>
              shift.date === format(selectedDate, "yyyy-MM-dd") &&
              shift.type === shiftType,
          );

          return (
            <MobileShiftsCell
              key={shiftType}
              shiftType={shiftType}
              shift={shift}
              handleShiftClick={handleShiftClick}
            />
          );
        })}
      </div>
      {selectedShift && (
        <StudentScheduleCalendarModal shift={selectedShift} onClose={onClose} />
      )}
    </div>
  );
}

export default MobileCalendar;
