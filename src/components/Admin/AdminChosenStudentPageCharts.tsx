import BarChartHoursByWeekday from "../charts/BarChartHoursByWeekday";

function AdminChosenStudentPageCharts() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2  h-full">
      <BarChartHoursByWeekday />
      <BarChartHoursByWeekday />
      <BarChartHoursByWeekday />
      <BarChartHoursByWeekday />
    </div>
  );
}

export default AdminChosenStudentPageCharts;
