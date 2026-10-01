import { useParams } from "react-router-dom";
import BarChartHoursByWeekday from "../charts/BarChartHoursByWeekday";
import HoursWorkedByShiftTypeChart from "../charts/HoursWorkedByShiftTypeChart";
import HoursWorkedOverTimeChart from "../charts/HoursWorkedOverTimeChart";
import { useGetStatsForShiftsUserHasWorked } from "../../hooks/useGetStatsForShiftsUserHasWorked";
import LoadingSpinner from "../LoadingSpinner";

function AdminChosenStudentPageCharts() {
  const { userId } = useParams<{ userId: string }>();
  const stats = useGetStatsForShiftsUserHasWorked(userId!);

  if (stats.status === "loading") return <LoadingSpinner size={82} />;
  if (stats.status === "error") return <p>Error loading data</p>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2  h-full ">
      <BarChartHoursByWeekday data={stats.data?.byWeekday} />
      <HoursWorkedByShiftTypeChart data={stats.data.byShiftTypes} />
      <HoursWorkedOverTimeChart />
    </div>
  );
}

export default AdminChosenStudentPageCharts;
