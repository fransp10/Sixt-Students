import AdminChosenStudentPageHeader from "./AdminChosenStudentPageHeader";
import AdminChosenStudentPageStats from "./AdminChosenStudentPageStats";
import AdminChosenStudentPageUpcomingShiftsList from "./AdminChosenStudentPageUpcomingShiftsList";

function AdminChosenStudentPage() {
  return (
    <div className=" flex-1  border-borderDividers border p-4 text-primaryText rounded-lg">
      <AdminChosenStudentPageHeader />
      <AdminChosenStudentPageStats />
      <AdminChosenStudentPageUpcomingShiftsList />
    </div>
  );
}

export default AdminChosenStudentPage;
