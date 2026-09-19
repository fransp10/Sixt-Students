import AdminChosenStudentPageCharts from "../components/Admin/AdminChosenStudentPageCharts";
import AdminChosenStudentPageStats from "../components/Admin/AdminChosenStudentPageStats";

function OverviewPage() {
  return (
    <div className="flex flex-col gap-2 p-4 lg:p-6  ">
      <AdminChosenStudentPageStats />
      <AdminChosenStudentPageCharts />
    </div>
  );
}

export default OverviewPage;
