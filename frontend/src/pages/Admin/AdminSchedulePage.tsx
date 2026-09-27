import { useState } from "react";
import SchedulePageCalendar from "../../components/scheduleCalendar/SchedulePageCalendar";
import PageHeading from "../../components/PageHeading";
import MobileCalendar from "../../components/scheduleCalendar/MobileCalendar";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import AdminScheduleCalendarModal from "../../components/scheduleCalendar/AdminScheduleCalendarModal";
import { useWeekSchedule } from "../../hooks/auth/useWeekSchedule";

function SchedulePage() {
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
    <div className=" flex flex-col gap-6">
      <PageHeading
        heading="Full schedule"
        subheading="View and manage all scheduled shifts"
      />
      <main>
        <div className="hidden lg:block ">
          <SchedulePageCalendar
            handleShiftClick={handleShiftClick}
            onSwitchDate={onSwitchDate}
            selectedDate={selectedDate}
          />
        </div>
        <div className="lg:hidden">
          <MobileCalendar
            handleShiftClick={handleShiftClick}
            onSwitchDate={onSwitchDate}
            selectedDate={selectedDate}
          />
        </div>
      </main>
      {selectedShiftId && (
        <AdminScheduleCalendarModal
          shift={
            getShiftById(selectedShiftId) as ShiftWithStudentsAndRequesters
          }
          onClose={() => setSelectedShiftId(null)}
        />
      )}
    </div>
  );
}

export default SchedulePage;
