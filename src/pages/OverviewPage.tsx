import AdminChosenStudentPageCharts from "../components/Admin/AdminChosenStudentPageCharts";
import AdminChosenStudentPageStats from "../components/Admin/AdminChosenStudentPageStats";

function OverviewPage() {
  return (
    <div>
      <AdminChosenStudentPageStats />
      <AdminChosenStudentPageCharts />
    </div>
  );
}

export default OverviewPage;
