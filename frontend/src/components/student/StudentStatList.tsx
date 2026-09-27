import {
  BanknotesIcon,
  CalendarIcon,
  ClockIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import StatsCard from "./StatsCard";
import NextShiftCard from "./NextShiftCard";

function StudentStatList() {
  return (
    <>
      <NextShiftCard />
      <StatsCard
        icon={BanknotesIcon}
        title="Earnings this month"
        value="573"
        prefix="$"
        lastMonthValue="500"
      />
      <StatsCard
        icon={CalendarIcon}
        title="Shifts worked this month"
        value="32"
        lastMonthValue="42"
      />
      <StatsCard
        icon={ClockIcon}
        title="Total hours this month"
        value="84"
        sufix="h"
        lastMonthValue="42"
      />
      <StatsCard
        icon={PlusCircleIcon}
        title="Attendance rate"
        value="92"
        sufix="%"
        lastMonthValue="100"
      />
    </>
  );
}

export default StudentStatList;
