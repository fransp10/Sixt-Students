import type { ShiftWithStudentsAndRequesters } from "../../../types/Shift";
import AvatarStack from "../../scheduleCalendar/AvatarStack";
import CellFrame from "./CellFrame";

function CurrentlyActiveShiftCell({
  onClick,
  shift,
  ariaLabel,
}: {
  onClick: () => void;
  shift: ShiftWithStudentsAndRequesters;
  ariaLabel?: string;
}) {
  return (
    <CellFrame kind="active" onClick={onClick} ariaLabel={ariaLabel}>
      <span className="-mt-1 text-xs text-secondaryText">
        Working students: {shift.students_assigned.length}
      </span>
      <div className="mt-auto">
        <AvatarStack students={shift.students_assigned} neutral />
      </div>
    </CellFrame>
  );
}

export default CurrentlyActiveShiftCell;
