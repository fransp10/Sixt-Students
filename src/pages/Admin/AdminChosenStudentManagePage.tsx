import { useParams } from "react-router-dom";
import { fakeStudents } from "../../helpers/helpers";
import AccountAccesSettingsCard from "../../components/AccountAccesSettingsCard";
import WorkSettingsCard from "../../components/WorkSettingsCard";
import DangerZoneCard from "../../components/Admin/DangerZoneCard";

function AdminChosenStudentManagePage() {
  const studentId = useParams().studentId;

  const student = fakeStudents.find((student) => student.id === studentId);

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
