import { CheckCircleIcon } from "@heroicons/react/24/outline";
import type { ShiftWithStudentsAndRequesters } from "../../../types/Shift";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";

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
    <td
      className="h-24 border border-borderDividers
             bg-cardBG text-secondaryText
              transition-colors "
    >
      <button
        className="block h-full w-full hover:bg-cardLighterBG cursor-pointer"
        onClick={onClick}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <CheckCircleIcon className="size-5 opacity-40" />

          <span className="text-sm font-semibold uppercase tracking-wide opacity-50">
            Shift passed
          </span>
          {isAdmin && (
            <>
              <span
                className="text-xs font-semibold uppercase tracking-wide opacity-50
         text-success"
              >
                Assigned: {shift.students_assigned.length}{" "}
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-wide opacity-50
        text-pending"
              >
                Requested: {shift.students_requesting.length}{" "}
              </span>
            </>
          )}
        </div>
      </button>
    </td>
  );
}

export default ShiftPassedCell;
