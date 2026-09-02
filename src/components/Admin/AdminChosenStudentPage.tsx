import AdminChosenStudentPageHeader from "./AdminChosenStudentPageHeader";
import CategoryMenu from "./CategoryMenu";
import { Outlet, useParams } from "react-router-dom";
import type { Student } from "../../types/students";
import { fakeStudents } from "../../helpers/helpers";

function AdminChosenStudentPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const selectedStudent: Student | undefined = fakeStudents.find(
    (student: Student) => student.id === studentId,
  );

  return (
    <div className=" flex-1 border-borderDividers border flex flex-col text-primaryText rounded-lg">
      <AdminChosenStudentPageHeader selectedStudent={selectedStudent} />
      <CategoryMenu />
      <Outlet />
    </div>
  );
}

export default AdminChosenStudentPage;
