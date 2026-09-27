import CalendarHeaderColumn from "./CalendarHeaderColumn";
import CalendarHeaderRow from "./CalendarHeaderRow";
import { isSameDay, isSameWeek } from "date-fns";
import DatePickerComponent from "./DatePickerComponent";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import type { ShiftType } from "../../types/Shift";
import type { SchedulePageCalendarProps } from "../../types/calendarProps";
import { useWeekSchedule } from "../../hooks/auth/useWeekSchedule";
import ScheduleCalendarCell from "../student/ScheduleCalendarCell";

const shiftTypes: ShiftType[] = ["morning", "middle", "afternoon"];

function SchedulePageCalendar({
  selectedDate,
  onSwitchDate,
  handleShiftClick,
}: SchedulePageCalendarProps) {
  const { data: currentUser } = useCurrentUser();

  const currentDate = new Date();
  const { days, getShift } = useWeekSchedule(selectedDate);
  console.log(getShift);
  return (
    <div className="w-full text-primaryText  rounded-2xl grid-rows-4">
      <DatePickerComponent
        onSwitchDate={onSwitchDate}
        selectedDate={selectedDate}
        isCurrentWeek={isSameWeek(selectedDate, currentDate, {
          weekStartsOn: 1,
        })}
      />
      <table className="table-fixed w-full">
        <thead className="">
          {/* empty cell */}
          <tr>
            <th className="w-40  border border-borderDividers bg-headersCalendar"></th>
            {days.map((day) => (
              <CalendarHeaderColumn
                key={day.toISOString()}
                day={day}
                isCurrentDay={isSameDay(day, currentDate)}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {shiftTypes.map((shiftType) => (
            <tr key={shiftType}>
              <CalendarHeaderRow shiftType={shiftType} />

              {days.map((day) => {
                const shift = getShift(day, shiftType);
                return (
                  <ScheduleCalendarCell
                    key={shift?.shift_id + day.toISOString()}
                    currentUserId={currentUser?.id}
                    shift={shift}
                    onClick={() => {
                      if (shift) {
                        handleShiftClick(shift.shift_id);
                      }
                    }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SchedulePageCalendar;
