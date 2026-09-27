import AdminStudentsPageContent from "../../components/Admin/AdminStudentsPageContent";
import { StudentsProvider } from "../../context/Providers/StudentsContextProvider";

function AdminStudentsPage() {
  return (
    <StudentsProvider>
      <AdminStudentsPageContent />
    </StudentsProvider>
  );
}

export default AdminStudentsPage;
