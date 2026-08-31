import AdminChosenStudentPage from "../../components/Admin/AdminChosenStudentPage";
import AdminStudentSearch from "../../components/Admin/AdminStudentSearch";
import PageHeading from "../../components/PageHeading";

function StudentsPage() {
  return (
    <div className=" flex flex-col gap-6 h-full  ">
      <PageHeading
        heading="Students"
        subheading=" Search and review student activity and performance"
      />

      <div className="flex flex-row gap-6 h-full">
        <AdminStudentSearch />
        <AdminChosenStudentPage />
      </div>
    </div>
  );
}

export default StudentsPage;
