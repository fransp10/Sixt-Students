import BarChartEarningsByMonth from "../../components/charts/BarChartEarningsByMonth";
import BarChartHoursByWeekday from "../../components/charts/BarChartHoursByWeekday";
import HoursWorkedByShiftTypeChart from "../../components/charts/HoursWorkedByShiftTypeChart";
import StudentStatList from "../../components/student/StudentStatList";
import TotalEarningsCard from "../../components/student/TotalEarningsCard";
import { fakeStudents } from "../../helpers/helpers";
import FavoriteShiftTypeCard from "../../components/student/FavoriteShiftTypeCard";

function StudentDashboardPage() {
  const currentStudent = fakeStudents[0];
  const currentTime = new Date().getHours();
  let greeting;

  if (currentTime < 10 && currentTime >= 5) {
    greeting = "Good morning";
  }
  if (currentTime >= 10 && currentTime < 18) {
    greeting = "Good afternoon";
  }
  if (currentTime >= 18 || currentTime < 5) {
    greeting = "Good evening";
  }

  return (
    <div>
      <div className="text-primaryText mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold ">
          {greeting}, User
        </h1>
        <p className="text-base md:text-xl text-secondaryText font-semibold">
          Here's an overview of your activities
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2  xl:grid-cols-5 ">
        {/* 1st row */}

        <StudentStatList />

        {/* 2nd row */}
        <div className="sm:col-span-2 xl:col-span-2">
          <BarChartHoursByWeekday />
        </div>
        <div className="sm:col-span-2 xl:col-span-2">
          <HoursWorkedByShiftTypeChart />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <FavoriteShiftTypeCard />
        </div>
        {/* 3rd row */}
        <div className="sm:col-span-2 xl:col-span-4">
          <BarChartEarningsByMonth />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <TotalEarningsCard />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
