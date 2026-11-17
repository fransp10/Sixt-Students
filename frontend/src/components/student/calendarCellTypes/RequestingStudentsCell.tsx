import type { StudentRequesting } from "../../../types/students";
import AvatarStack from "../../scheduleCalendar/AvatarStack";
import CellFrame from "./CellFrame";

function RequestingStudentsCell({
  students,
  onClick,
}: {
  students: StudentRequesting[];
  onClick: () => void;
}) {
  return (
    <CellFrame kind="requested" onClick={onClick}>
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
