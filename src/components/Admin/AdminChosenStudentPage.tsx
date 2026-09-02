import { useState } from "react";
import AdminChosenStudentPageHeader from "./AdminChosenStudentPageHeader";
import CategoryMenu from "./CategoryMenu";
import type { Category } from "../../types/category";
import OverviewPage from "../../pages/OverviewPage";
import { Outlet, useParams } from "react-router-dom";
import type { Student } from "../../types/students";
import { fakeStudents } from "../../helpers/helpers";

function AdminChosenStudentPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const selectedStudent: Student | undefined = fakeStudents.find(
    (student: Student) => student.id === studentId,
  );

  console.log("Selected Student:", selectedStudent);

  return (
    <div className=" flex-1 border-borderDividers border flex flex-col gap-4  text-primaryText rounded-lg">
      <AdminChosenStudentPageHeader selectedStudent={selectedStudent} />
      <CategoryMenu />
      <Outlet />
    </div>
  );
}

export default AdminChosenStudentPage;
