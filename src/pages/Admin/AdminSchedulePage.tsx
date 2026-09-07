import { useState } from "react";
import SchedulePageCalendar from "../../components/scheduleCalendar/SchedulePageCalendar";
import { startOfWeek } from "date-fns";
import PageHeading from "../../components/PageHeading";

function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  function onSwitchDate(newDate: Date) {
    setSelectedDate(newDate);
  }

  return (
    <div className=" flex flex-col gap-6">
      <PageHeading
        heading="Full schedule"
        subheading="View and manage all scheduled shifts"
      />
      <main>
        <SchedulePageCalendar
          calendarType="admin"
          onSwitchDate={onSwitchDate}
          selectedDate={selectedDate}
        />
      </main>
    </div>
  );
}

export default SchedulePage;
