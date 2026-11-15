import DashboardHeader from "../../components/student/Dashboard/DashboardHeader";
import StudentDashboardContent from "../../components/student/Dashboard/StudentDashboardContent";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

function StudentDashboardPage() {
  const { currentUser } = useAuthContext();

  if (!currentUser) {
    return <div>No current user</div>;
  }

  return (
    <StudentDashboardContent
      header={
        <DashboardHeader subheading="Here's an overview of your activities" />
      }
    />
  );
}

export default StudentDashboardPage;
