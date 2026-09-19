import { useState, Fragment } from "react";
import CalendarHeaderColumn from "./CalendarHeaderColumn";
import CalendarHeaderRow from "./CalendarHeaderRow";
// import ScheduleCalendarModal from "./ScheduleCalendarModal";
import {
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
  isSameWeek,
  startOfWeek,
} from "date-fns";
import { format } from "date-fns";
import DatePickerComponent from "./DatePickerComponent";
import StudentsShceduleCalendarCell from "../student/ScheduleCalendarCell";
import StudentScheduleCalendarModal from "../student/StudentScheduleCalendarModal";
import { useGetShiftsWithStudentsAndRequesters } from "../../hooks/auth/useGetShiftsWithStudentsAndRequesters";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import type {
  ShiftType,
  ShiftWithStudentsAndRequesters,
} from "../../types/Shift";
import ScheduleCalendarModal from "./AdminScheduleCalendarModal";

const shiftTypes: ShiftType[] = ["morning", "middle", "afternoon"];

type SchedulePageCalendarProps = {
  selectedDate: Date;
  onSwitchDate: (newDate: Date) => void;
  calendarType: "admin" | "student";
};

function SchedulePageCalendar({
  selectedDate,
  onSwitchDate,
  calendarType,
}: SchedulePageCalendarProps) {
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
  const { data: currentUser } = useCurrentUser();

  const { data: shifts, isLoading } = useGetShiftsWithStudentsAndRequesters(
    format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  );

  if (!shifts && !isLoading) {
    console.log("No shifts found for the selected week.");
  }

  const days = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  });

  const currentDate = new Date();

  const selectedShift = shifts?.find(
    (shift) => shift.shift_id === selectedShiftId,
  );

  return (
    <div className="grid grid-cols-8 text-primaryText  rounded-2xl grid-rows-4">
      <DatePickerComponent
        onSwitchDate={onSwitchDate}
        selectedDate={selectedDate}
        isCurrentWeek={isSameWeek(selectedDate, currentDate, {
          weekStartsOn: 1,
        })}
      />
      {/* Empty top-left corner */}
      <div className="bg-headersCalendar px-8 py-4 border border-borderDividers flex flex-col  text-primaryText  justify-center text-xl">
        Shift
      </div>

      {/* COLUMN HEADERS */}

      {days.map((day) => (
        <CalendarHeaderColumn
          isCurrentDay={isSameDay(day, currentDate)}
          day={day}
          key={format(day, "yyyy-MM-dd")}
        />
      ))}

      {/* ROWS */}
      {!isLoading && shifts && shifts.length > 0 ? (
        shiftTypes.map((shiftType) => (
          <Fragment key={shiftType}>
            {/* ROW HEADER */}
            <CalendarHeaderRow shiftType={shiftType} />

            {/* 7 CELLS */}
            {days.map((day) => {
              const shift = shifts.find((s: ShiftWithStudentsAndRequesters) => {
                return (
                  isSameDay(new Date(s.date), day) && s.shift_type === shiftType
                );
              });
              return (
                <StudentsShceduleCalendarCell
                  onClick={() => {
                    if (shift) setSelectedShiftId(shift.shift_id);
                  }}
                  key={`${format(day, "yyyy-MM-dd")}-${shiftType}`}
                  shift={shift!}
                  currentUserId={currentUser?.id}
                />
              );
            })}
          </Fragment>
        ))
      ) : (
        <div className="col-span-8 row-span-4 flex items-center justify-center text-xl text-primaryText">
          {isLoading
            ? "Loading shifts..."
            : "No shifts found for the selected week."}
        </div>
      )}
      {selectedShift && calendarType === "admin" && (
        <ScheduleCalendarModal
          onClose={() => setSelectedShiftId(null)}
          shift={selectedShift}
        />
      )}

      {selectedShift && calendarType === "student" && (
        <StudentScheduleCalendarModal
          onClose={() => setSelectedShiftId(null)}
          shift={selectedShift}
        />
      )}
    </div>
  );
}

export default SchedulePageCalendar;
