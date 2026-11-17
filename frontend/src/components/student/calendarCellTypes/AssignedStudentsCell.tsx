import type { StudentAssigned } from "../../../types/students";
import AvatarStack from "../../scheduleCalendar/AvatarStack";
import CellFrame from "./CellFrame";

function AssignedStudentsCell({
  onClick,
  students,
}: {
  onClick: () => void;
  students: StudentAssigned[];
}) {
  return (
    <CellFrame kind="assigned" onClick={onClick}>
      <div className="mt-auto">
        <AvatarStack kind="assigned" students={students} />
      </div>
    </CellFrame>
  );
}

export default AssignedStudentsCell;
