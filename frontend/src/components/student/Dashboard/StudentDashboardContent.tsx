import { useState, type ReactNode } from "react";
import { format, isSameMonth, parseISO, startOfMonth } from "date-fns";
import BarChartEarningsByMonth from "../../charts/BarChartEarningsByMonth";
import BarChartHoursByWeekday from "../../charts/BarChartHoursByWeekday";
import HoursWorkedByShiftTypeChart from "../../charts/HoursWorkedByShiftTypeChart";
import PeriodBar from "../../PeriodBar/PeriodBar";
import FavoriteShiftTypeCard from "../FavoriteShiftTypeCard";
import StudentStatList from "../StudentStatList";
import TotalEarningsCard from "../TotalEarningsCard";
import { useGetUserStats } from "../../../hooks/useGetUserStats";

type StudentDashboardContentProps = {
  userId?: string;
  header?: ReactNode;
};

function StudentDashboardContent({
  userId,
  header,
}: StudentDashboardContentProps) {
  const { data: stats } = useGetUserStats(userId);
  const [chosenMonth, setChosenMonth] = useState(() =>
    startOfMonth(new Date()),
  );

  if (!stats) {
    return <div>Loading...</div>;
  }
  // the current month, plus any month the student has stats for
  const isMonthSelectable = (month: Date) =>
    isSameMonth(month, new Date()) ||
    stats.byMonth.some((m) => m.month === format(month, "yyyy-MM"));

  // byMonth is ordered oldest first
  const firstMonth = stats.byMonth[0]
    ? parseISO(stats.byMonth[0].month)
    : startOfMonth(new Date());

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        {header}
        <PeriodBar
          label="Showing stats for"
          onMonthChange={setChosenMonth}
          selectedMonth={chosenMonth}
          minMonth={firstMonth}
          isMonthSelectable={isMonthSelectable}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2  xl:grid-cols-5 ">
        {/* 1st row */}

        <StudentStatList chosenMonth={chosenMonth} userId={userId} />

        {/* 2nd row */}
        <div className="sm:col-span-2 xl:col-span-2">
          <BarChartHoursByWeekday data={stats.byWeekday} />
        </div>
        <div className="sm:col-span-2 xl:col-span-2">
          <HoursWorkedByShiftTypeChart data={stats.byShiftTypes} />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <FavoriteShiftTypeCard userId={userId} />
        </div>
        {/* 3rd row */}
        <div className="sm:col-span-2 xl:col-span-4">
          <BarChartEarningsByMonth userId={userId} />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <TotalEarningsCard stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardContent;
