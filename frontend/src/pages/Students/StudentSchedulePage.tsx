import { useState } from "react";
import PageHeading from "../../components/PageHeading";
import SchedulePageCalendar from "../../components/scheduleCalendar/SchedulePageCalendar";
import { startOfWeek } from "date-fns";
import StudentScheduleCalendarModal from "../../components/student/StudentScheduleCalendarModal";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import { useWeekSchedule } from "../../hooks/auth/useWeekSchedule";

function StudentSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

  const handleShiftClick = (shiftId: number | null) => {
    setSelectedShiftId(shiftId);
  };

  function onSwitchDate(newDate: Date) {
    setSelectedDate(newDate);
  }
  const { getShiftById } = useWeekSchedule(selectedDate);

  return (
    <div>
      <div className="flex flex-col gap-4 h-full">
        <PageHeading
          heading="Student Schedule"
          subheading="Choose the shift you want to work"
        />

        <SchedulePageCalendar
          onSwitchDate={onSwitchDate}
          selectedDate={selectedDate}
          handleShiftClick={handleShiftClick}
        />
      </div>
      {selectedShiftId && (
        <StudentScheduleCalendarModal
          onClose={() => handleShiftClick(null)}
          shift={
            getShiftById(selectedShiftId) as ShiftWithStudentsAndRequesters
          }
        />
      )}
    </div>
  );
}

export default StudentSchedulePage;
