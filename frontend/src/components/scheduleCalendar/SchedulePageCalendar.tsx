import CalendarHeaderColumn from "./CalendarHeaderColumn";
import CalendarHeaderRow from "./CalendarHeaderRow";
import { isSameDay, isSameWeek } from "date-fns";
import DatePickerComponent from "./DatePickerComponent";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import type { SchedulePageCalendarProps } from "../../types/calendarProps";
import { useWeekSchedule } from "../../hooks/auth/useWeekSchedule";
import ScheduleCalendarCell from "../student/ScheduleCalendarCell";
import { SHIFT_TYPES } from "../../config/shiftHours";

function SchedulePageCalendar({
  selectedDate,
  onSwitchDate,
  handleShiftClick,
}: SchedulePageCalendarProps) {
  const { data: currentUser } = useCurrentUser();

  const currentDate = new Date();
  const { days, getShift } = useWeekSchedule(selectedDate);
  return (
    <section className="w-full overflow-hidden rounded-xl border border-borderDividers bg-cardBG text-primaryText">
      <DatePickerComponent
        onSwitchDate={onSwitchDate}
        selectedDate={selectedDate}
        isCurrentWeek={isSameWeek(selectedDate, currentDate, {
          weekStartsOn: 1,
        })}
      />
      <div className="overflow-x-auto">
        <div
          role="table"
          aria-label="Weekly shift schedule"
          className="grid min-w-5xl grid-cols-[9rem_repeat(7,minmax(0,1fr))] gap-2 p-4"
        >
          <div role="row" className="contents">
            <div role="columnheader" className="sr-only">
              Shift
            </div>
            {days.map((day) => (
              <CalendarHeaderColumn
                key={day.toISOString()}
                day={day}
                isCurrentDay={isSameDay(day, currentDate)}
              />
            ))}
          </div>
          {SHIFT_TYPES.map((shiftType) => (
            <div role="row" className="contents" key={shiftType}>
              <CalendarHeaderRow shiftType={shiftType} />

              {days.map((day) => {
                const shift = getShift(day, shiftType);
                return (
                  <div
                    role="cell"
                    className="flex min-h-34"
                    key={shift?.shift_id + day.toISOString()}
                  >
                    <ScheduleCalendarCell
                      currentUserId={currentUser?.id}
                      shift={shift}
                      onClick={() => {
                        if (shift) {
                          handleShiftClick(shift.shift_id);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SchedulePageCalendar;
