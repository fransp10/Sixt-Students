import type { StudentAssigned } from "../../../types/students";
import AvatarStack from "../../scheduleCalendar/AvatarStack";
import CellFrame from "./CellFrame";

function AssignedStudentsCell({
  onClick,
  students,
  ariaLabel,
}: {
  onClick: () => void;
  students: StudentAssigned[];
  ariaLabel?: string;
}) {
  return (
    <CellFrame kind="assigned" onClick={onClick} ariaLabel={ariaLabel}>
      <div className="mt-auto">
        <AvatarStack kind="assigned" students={students} />
      </div>
    </CellFrame>
  );
}

export default AssignedStudentsCell;
