import { useState, Fragment } from "react";
import CalendarHeaderColumn from "./CalendarHeaderColumn";
import CalendarHeaderRow from "./CalendarHeaderRow";
import ScheduleCalendarModal from "./ScheduleCalendarModal";
import {
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
  isSameWeek,
  startOfWeek,
} from "date-fns";
import { format } from "date-fns";
import DatePickerComponent from "./DatePickerComponent";
import AdminScheduleCalendarCell from "./AdminScheduleCalendarCell";
import StudentsShceduleCalendarCell from "../student/StudentsScheduleCalendarCell";
import StudentScheduleCalendarModal from "../student/StudentScheduleCalendarModal";
export type Shift = {
  id: number;
  date: string;
  type: "morning" | "middle" | "afternoon";
  students: Student[];
};

type Student = {
  id: number;
  name: string;
};
export type selectedShiftType = {
  date: string;
  shiftType: shiftTypeType["name"];
  shift?: Shift;
};

export type shiftTypeType = {
  name: "Morning" | "Middle" | "Afternoon";
  time: string;
};

const shiftTypes: shiftTypeType[] = [
  {
    name: "Morning",
    time: "07:00 - 15:00",
  },
  {
    name: "Middle",
    time: "10:00 - 18:00",
  },
  {
    name: "Afternoon",
    time: "14:00 - 22:00",
  },
];

const shifts: Shift[] = [
  {
    id: 1,
    date: "2026-09-9",
    type: "morning",
    students: [
      { id: 1, name: "Luka Marić" },
      { id: 2, name: "Petra Antić" },
      { id: 3, name: "Petra Antić" },
      { id: 4, name: "Petra Antić" },
      { id: 5, name: "Petra Antić" },
    ],
  },

  {
    id: 2,
    date: "2026-08-18",
    type: "middle",
    students: [{ id: 8, name: "Ivan Vuković" }],
  },
];

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
  const [selectedShift, setSelectedShift] = useState<selectedShiftType | null>(
    null,
  );
  const days = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  });
  const currentDate = new Date();

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
      {shiftTypes.map((shiftType) => (
        <Fragment key={shiftType.name}>
          {/* ROW HEADER */}
          <CalendarHeaderRow shiftType={shiftType} />

          {/* 7 CELLS */}
          {days.map((day) => {
            const shift = shifts.find(
              (s) =>
                isSameDay(new Date(s.date), day) &&
                s.type === shiftType.name.toLowerCase(),
            );
            if (calendarType === "student") {
              return (
                <StudentsShceduleCalendarCell
                  onClick={() =>
                    setSelectedShift({
                      date: format(day, "yyyy-MM-dd"),
                      shiftType: shiftType.name,
                      shift,
                    })
                  }
                  key={`${format(day, "yyyy-MM-dd")}-${shiftType.name}`}
                  date={format(day, "yyyy-MM-dd")}
                  shiftType={shiftType.name}
                  shift={shift}
                />
              );
            }
            if (calendarType === "admin") {
              return (
                <AdminScheduleCalendarCell
                  onClick={() =>
                    setSelectedShift({
                      date: format(day, "yyyy-MM-dd"),
                      shiftType: shiftType.name,
                      shift,
                    })
                  }
                  key={`${format(day, "yyyy-MM-dd")}-${shiftType.name}`}
                  date={format(day, "yyyy-MM-dd")}
                  shiftType={shiftType.name}
                  shift={shift}
                />
              );
            }
          })}
        </Fragment>
      ))}
      {selectedShift !== null && calendarType === "admin" && (
        <ScheduleCalendarModal
          onClose={() => setSelectedShift(null)}
          shift={selectedShift}
        />
      )}

      {selectedShift !== null && calendarType === "student" && (
        <StudentScheduleCalendarModal
          onClose={() => setSelectedShift(null)}
          shift={selectedShift}
        />
      )}
    </div>
  );
}

export default SchedulePageCalendar;
