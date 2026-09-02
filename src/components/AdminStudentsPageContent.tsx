import { Outlet } from "react-router-dom";
import { useStudentsCtx } from "../context/StudentsContext";

import AdminStudentSearchModal from "./Admin/AdminStudentSearchModal";
import PageHeading from "./PageHeading";

function AdminStudentsPageContent() {
  const { isSearchOpen } = useStudentsCtx();
  return (
    <div className=" flex flex-col gap-6 h-full  ">
      <PageHeading
        heading="Students"
        subheading=" Search and review student activity and performance"
      />
      <Outlet />
      {isSearchOpen && <AdminStudentSearchModal />}
    </div>
  );
}

export default AdminStudentsPageContent;
