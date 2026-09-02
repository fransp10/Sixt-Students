import AdminChosenStudentPageCharts from "../components/Admin/AdminChosenStudentPageCharts";
import AdminChosenStudentPageStats from "../components/Admin/AdminChosenStudentPageStats";

function OverviewPage() {
  return (
    <div className="flex flex-col gap-2 px-8 md:px-12 ">
      <AdminChosenStudentPageStats />
      <AdminChosenStudentPageCharts />
    </div>
  );
}

export default OverviewPage;
