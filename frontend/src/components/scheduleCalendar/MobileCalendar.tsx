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
import type { SchedulePageCalendarProps } from "../../types/calendartProps";
import { useWeekSchedule } from "../../hooks/auth/useWeekSchedule";

type ShiftType = "morning" | "middle" | "afternoon";
const shiftTypes: ShiftType[] = ["morning", "middle", "afternoon"];
function MobileCalendar({
  handleShiftClick,
  onSwitchDate,
  selectedDate,
}: SchedulePageCalendarProps) {
  const weekToDisplay = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  });
  const { getShift } = useWeekSchedule(selectedDate);
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
          const shift = getShift(selectedDate, shiftType);
          return (
            <MobileShiftsCell
              key={shiftType}
              shiftType={shiftType}
              shift={shift}
              handleShiftClick={(shift) => {
                if (shift) handleShiftClick(shift.shift_id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MobileCalendar;
