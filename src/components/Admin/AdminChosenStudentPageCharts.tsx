import BarChartHoursByWeekday from "../charts/BarChartHoursByWeekday";
import HoursWorkedByShiftTypeChart from "../charts/HoursWorkedByShiftTypeChart";
import HoursWorkedOverTimeChart from "../charts/HoursWorkedOverTimeChart";

function AdminChosenStudentPageCharts() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2  h-full ">
      <BarChartHoursByWeekday />
      <HoursWorkedByShiftTypeChart />
      <HoursWorkedOverTimeChart />
    </div>
  );
}

export default AdminChosenStudentPageCharts;
