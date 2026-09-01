import { useStudentsCtx } from "../context/StudentsContext";
import AdminChosenStudentPage from "./Admin/AdminChosenStudentPage";
import AdminStudentNoStudentSelected from "./Admin/AdminStudentNoStudentSelected";
import AdminStudentSearchModal from "./Admin/AdminStudentSearchModal";
import PageHeading from "./PageHeading";

function AdminStudentsPageContent() {
  const { selectedStudent, isSearchOpen } = useStudentsCtx();
  return (
    <div className=" flex flex-col gap-6 h-full  ">
      <PageHeading
        heading="Students"
        subheading=" Search and review student activity and performance"
      />
      {selectedStudent ? (
        <AdminChosenStudentPage />
      ) : (
        <AdminStudentNoStudentSelected />
      )}
      {isSearchOpen && <AdminStudentSearchModal />}
    </div>
  );
}

export default AdminStudentsPageContent;
