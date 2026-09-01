import { StudentsProvider } from "../../context/StudentsContext";
import AdminStudentsPageContent from "../../components/AdminStudentsPageContent";

function StudentsPage() {
  return (
    <StudentsProvider>
      <AdminStudentsPageContent />
    </StudentsProvider>
  );
}

export default StudentsPage;
