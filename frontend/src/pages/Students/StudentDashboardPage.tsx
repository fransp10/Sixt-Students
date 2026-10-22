import BarChartEarningsByMonth from "../../components/charts/BarChartEarningsByMonth";
import BarChartHoursByWeekday from "../../components/charts/BarChartHoursByWeekday";
import HoursWorkedByShiftTypeChart from "../../components/charts/HoursWorkedByShiftTypeChart";
import StudentStatList from "../../components/student/StudentStatList";
import TotalEarningsCard from "../../components/student/TotalEarningsCard";
import FavoriteShiftTypeCard from "../../components/student/FavoriteShiftTypeCard";

import { useState } from "react";
import { useGetMyStats } from "../../hooks/useGetMyStats";
import DashBoardPageSelectMonth from "./DashBoardPageSelectMonth";
import DashboardHeader from "../../components/student/Dashboard/DashboardHeader";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

function StudentDashboardPage() {
  const { data: stats } = useGetMyStats();
  const [chosenMonth, setChosenMonth] = useState(new Date());
  const { currentUser } = useAuthContext();

  if (!currentUser) {
    return <div>No current user</div>;
  }

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <DashboardHeader subheading="Here's an overview of your activities" />
        <DashBoardPageSelectMonth
          byMonth={stats?.byMonth ?? {}}
          onChange={setChosenMonth}
          value={chosenMonth}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2  xl:grid-cols-5 ">
        {/* 1st row */}

        <StudentStatList chosenMonth={chosenMonth} />

        {/* 2nd row */}
        <div className="sm:col-span-2 xl:col-span-2">
          <BarChartHoursByWeekday data={stats.byWeekday} />
        </div>
        <div className="sm:col-span-2 xl:col-span-2">
          <HoursWorkedByShiftTypeChart data={stats.byShiftTypes} />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <FavoriteShiftTypeCard />
        </div>
        {/* 3rd row */}
        <div className="sm:col-span-2 xl:col-span-4">
          <BarChartEarningsByMonth />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <TotalEarningsCard stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
