import { useState } from "react";
import SchedulePageCalendar from "../../components/scheduleCalendar/SchedulePageCalendar";
import PageHeading from "../../components/PageHeading";
import MobileCalendar from "../../components/scheduleCalendar/MobileCalendar";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";

function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
        <div className="hidden lg:block ">
          <SchedulePageCalendar
            calendarType="admin"
            onSwitchDate={onSwitchDate}
            selectedDate={selectedDate}
          />
        </div>
        <div className="lg:hidden">
          <MobileCalendar
            calendarType="admin"
            onSwitchDate={onSwitchDate}
            selectedDate={selectedDate}
          />
        </div>
      </main>
    </div>
  );
}

export default SchedulePage;
