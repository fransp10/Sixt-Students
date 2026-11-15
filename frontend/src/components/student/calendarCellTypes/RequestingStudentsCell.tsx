import type { StudentRequesting } from "../../../types/students";
import AvatarStack from "../../scheduleCalendar/AvatarStack";
import CellFrame from "./CellFrame";

function RequestingStudentsCell({
  students,
  onClick,
  ariaLabel,
}: {
  students: StudentRequesting[];
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <CellFrame kind="requested" onClick={onClick} ariaLabel={ariaLabel}>
      <span className="-mt-1 text-xs text-secondaryText">
        Waiting for approval
      </span>
      <div className="mt-auto">
        <AvatarStack kind="requested" students={students} />
      </div>
    </CellFrame>
  );
}

export default RequestingStudentsCell;
