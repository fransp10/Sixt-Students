import type { ShiftWithStudentsAndRequesters } from "../../../types/Shift";
import AvatarStack from "../../scheduleCalendar/AvatarStack";
import CellFrame from "./CellFrame";

function CurrentlyActiveShiftCell({
  onClick,
  shift,
}: {
  onClick: () => void;
  shift: ShiftWithStudentsAndRequesters;
}) {
  return (
    <CellFrame kind="active" onClick={onClick}>
      <span className="-mt-1 text-xs text-secondaryText">
        Working students: {shift.students_assigned.length}
      </span>
      <div className="mt-auto">
        <AvatarStack kind="active" students={shift.students_assigned} neutral />
      </div>
    </CellFrame>
  );
}

export default CurrentlyActiveShiftCell;
