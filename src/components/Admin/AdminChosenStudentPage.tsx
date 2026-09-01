import AdminChosenStudentPageCharts from "./AdminChosenStudentPageCharts";
import AdminChosenStudentPageHeader from "./AdminChosenStudentPageHeader";
import AdminChosenStudentPageStats from "./AdminChosenStudentPageStats";

function AdminChosenStudentPage() {
  return (
    <div className=" flex-1 border-borderDividers border flex flex-col gap-4  text-primaryText rounded-lg">
      <AdminChosenStudentPageHeader />
      <AdminChosenStudentPageStats />
      <AdminChosenStudentPageCharts />
    </div>
  );
}

export default AdminChosenStudentPage;
