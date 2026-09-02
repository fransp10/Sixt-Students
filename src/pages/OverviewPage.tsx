import AdminChosenStudentPageCharts from "../components/Admin/AdminChosenStudentPageCharts";
import AdminChosenStudentPageStats from "../components/Admin/AdminChosenStudentPageStats";

function OverviewPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <AdminChosenStudentPageStats />
      <AdminChosenStudentPageCharts />
    </div>
  );
}

export default OverviewPage;
