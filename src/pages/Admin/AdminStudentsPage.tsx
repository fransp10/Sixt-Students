import AdminStudentsPageContent from "../../components/Admin/AdminStudentsPageContent";
import { StudentsProvider } from "../../context/StudentsContext";

function AdminStudentsPage() {
  return (
    <StudentsProvider>
      <AdminStudentsPageContent />
    </StudentsProvider>
  );
}

export default AdminStudentsPage;
