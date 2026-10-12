import { useParams } from "react-router-dom";
import AccountAccesSettingsCard from "../../components/AccountAccesSettingsCard";
import WorkSettingsCard from "../../components/WorkSettingsCard";
import DangerZoneCard from "../../components/Admin/DangerZoneCard";
import { useGetUserById } from "../../hooks/useGetUserById";

function AdminChosenStudentManagePage() {
  const { userId } = useParams<{ userId: string }>();

  const { data: student, isLoading, isError } = useGetUserById(userId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading student data</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row items-stretch gap-4 rounded-lg   ">
        <AccountAccesSettingsCard student={student} />
        <WorkSettingsCard student={student} />
      </div>
      <div className="flex-1 ">
        <DangerZoneCard student={student} />
      </div>
    </div>
  );
}

export default AdminChosenStudentManagePage;
