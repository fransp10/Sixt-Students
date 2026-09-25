import AdminChosenStudentPageHeader from "./AdminChosenStudentPageHeader";
import CategoryMenu from "./CategoryMenu";
import { Outlet, useParams } from "react-router-dom";
import { useGetAllUsers } from "../../hooks/useGetAllUsers";
import type { UserMeType } from "../../types/user";

function AdminChosenStudentPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: users, isLoading } = useGetAllUsers("student");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const selectedStudent: UserMeType | undefined = users?.find(
    (user) => user?.id === Number(userId),
  ) as UserMeType | undefined;

  console.log("Selected Student:", selectedStudent);

  return (
    <div className=" flex-1 border-borderDividers border flex flex-col text-primaryText rounded-lg">
      <AdminChosenStudentPageHeader selectedStudent={selectedStudent} />
      <CategoryMenu />
      <Outlet />
    </div>
  );
}

export default AdminChosenStudentPage;
