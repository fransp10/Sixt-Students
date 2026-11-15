import { useParams } from "react-router-dom";
import StudentDashboardContent from "../components/student/Dashboard/StudentDashboardContent";

function OverviewPage() {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="p-4 lg:p-6">
      <StudentDashboardContent userId={userId} />
    </div>
  );
}

export default OverviewPage;
