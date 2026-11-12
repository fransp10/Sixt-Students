import { useState } from "react";
import PageHeading from "../../components/PageHeading";
import SchedulePageCalendar from "../../components/scheduleCalendar/SchedulePageCalendar";
import MobileCalendar from "../../components/scheduleCalendar/MobileCalendar";
import StudentScheduleCalendarModal from "../../components/student/StudentScheduleCalendarModal";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import { useWeekSchedule } from "../../hooks/auth/useWeekSchedule";

function StudentSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
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

        <div className="hidden xl:block">
          <SchedulePageCalendar
            onSwitchDate={onSwitchDate}
            selectedDate={selectedDate}
            handleShiftClick={handleShiftClick}
          />
        </div>
        <div className="xl:hidden">
          <MobileCalendar
            onSwitchDate={onSwitchDate}
            selectedDate={selectedDate}
            handleShiftClick={handleShiftClick}
          />
        </div>
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
