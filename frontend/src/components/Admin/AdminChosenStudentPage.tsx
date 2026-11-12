import AdminChosenStudentPageHeader from "./AdminChosenStudentPageHeader";
import CategoryMenu from "./CategoryMenu";
import { Outlet, useParams } from "react-router-dom";
import { useGetUserById } from "../../hooks/useGetUserById";
function AdminChosenStudentPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: selectedStudent, isLoading } = useGetUserById(userId!);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" flex-1 min-h-0 border-borderDividers border flex flex-col text-primaryText rounded-lg">
      <AdminChosenStudentPageHeader selectedStudent={selectedStudent} />
      <CategoryMenu />
      <Outlet />
    </div>
  );
}

export default AdminChosenStudentPage;
