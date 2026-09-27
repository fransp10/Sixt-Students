import { Outlet } from "react-router-dom";
import AdminStudentSearchModal from "./AdminStudentSearchModal";
import PageHeading from "../PageHeading";
import { useStudentsCtx } from "../../hooks/auth/useStudentsContext";

function AdminStudentsPageContent() {
  const { isSearchOpen } = useStudentsCtx();
  return (
    <div className=" flex flex-col gap-4 h-full  ">
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
