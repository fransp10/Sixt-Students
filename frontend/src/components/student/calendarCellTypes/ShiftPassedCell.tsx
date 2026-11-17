import type { ShiftWithStudentsAndRequesters } from "../../../types/Shift";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";
import CellFrame from "./CellFrame";

function ShiftPassedCell({
  onClick,
  shift,
}: {
  onClick: () => void;
  shift: ShiftWithStudentsAndRequesters;
}) {
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.user_role === "admin";
  return (
    <CellFrame kind="passed" onClick={onClick}>
      {isAdmin && (
        <span className="mt-auto flex flex-col gap-0.5 text-xs">
          <span className="text-success/80">
            Assigned: {shift.students_assigned.length}
          </span>
          <span className="text-pending/80">
            Requested: {shift.students_requesting.length}
          </span>
        </span>
      )}
    </CellFrame>
  );
}

export default ShiftPassedCell;
