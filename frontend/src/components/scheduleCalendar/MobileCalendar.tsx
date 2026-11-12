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
import type { SchedulePageCalendarProps } from "../../types/calendarProps";
import { useWeekSchedule } from "../../hooks/auth/useWeekSchedule";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import { SHIFT_TYPES } from "../../config/shiftHours";

const stepButton =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surfaceCards transition-colors duration-200 hover:bg-darkBackground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function MobileCalendar({
  handleShiftClick,
  onSwitchDate,
  selectedDate,
}: SchedulePageCalendarProps) {
  const { data: currentUser } = useCurrentUser();
  const weekToDisplay = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  });
  const { getShift } = useWeekSchedule(selectedDate);
  return (
    <div className="flex flex-col gap-4 text-primaryText">
      <div className="flex flex-col gap-3 rounded-xl border border-borderDividers bg-cardBG p-3">
        {/* Day stepper */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Previous day"
            className={stepButton}
            onClick={() => onSwitchDate(subDays(selectedDate, 1))}
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold leading-tight">
              {format(selectedDate, "EEEE")}
            </p>
            <p className="flex items-center justify-center gap-2 text-sm text-secondaryText">
              {isSameDay(selectedDate, new Date()) && (
                <>
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-primary"
                  />
                  <span className="sr-only">Today, </span>
                </>
              )}
              {format(selectedDate, "d MMMM")}
            </p>
          </div>
          <button
            type="button"
            aria-label="Next day"
            className={stepButton}
            onClick={() => onSwitchDate(addDays(selectedDate, 1))}
          >
            <ChevronRightIcon className="size-5" />
          </button>
        </div>
        {/* Week strip */}
        <div className="grid grid-cols-7 gap-1">
          {weekToDisplay.map((day) => {
            const isSelected = isSameDay(selectedDate, day);
            return (
              <button
                type="button"
                onClick={() => onSwitchDate(day)}
                aria-pressed={isSelected}
                aria-label={format(day, "EEEE d MMMM")}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border py-1.5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent hover:bg-cardLighterBG"
                }`}
                key={format(day, "yyyy-MM-dd")}
              >
                <span
                  className={`text-xs ${isSelected ? "text-primary" : "text-secondaryText"}`}
                >
                  {format(day, "E")}
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {format(day, "d")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {SHIFT_TYPES.map((shiftType) => {
          const shift = getShift(selectedDate, shiftType);
          return (
            <MobileShiftsCell
              key={shiftType}
              shiftType={shiftType}
              shift={shift}
              currentUserId={currentUser?.id}
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
