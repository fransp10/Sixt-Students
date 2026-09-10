import { useState } from "react";
import PageHeading from "../../components/PageHeading";
import SchedulePageCalendar from "../../components/scheduleCalendar/SchedulePageCalendar";
import { startOfWeek } from "date-fns";

function StudentSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  function onSwitchDate(newDate: Date) {
    setSelectedDate(newDate);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 h-full">
        <PageHeading
          heading="Student Schedule"
          subheading="Choose the shift you want to work"
        />

        <SchedulePageCalendar
          calendarType="student"
          onSwitchDate={onSwitchDate}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}

export default StudentSchedulePage;
