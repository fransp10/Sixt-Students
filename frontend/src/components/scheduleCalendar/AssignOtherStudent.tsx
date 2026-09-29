import { UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import AssignOtherStudentPanel from "./AdminModal/AssignOtherStudentPanel";
import type { UserMeType } from "../../types/user";

type AssignOtherStudentProps = {
  assignedIds: number[];
  requestingIds: number[];
  pendingUserId?: number;
  onAssign: (student: UserMeType) => void;
};

function AssignOtherStudent({
  assignedIds,
  requestingIds,
  pendingUserId,
  onAssign,
}: AssignOtherStudentProps) {
  const [isAssignOthersOpen, setIsAssignOthersOpen] = useState(false);
  return (
    <div className="flex flex-col">
      {/* the panel only mounts (and fetches students) while open */}
      {isAssignOthersOpen ? (
        <AssignOtherStudentPanel
          assignedIds={assignedIds}
          requestingIds={requestingIds}
          pendingUserId={pendingUserId}
          onAssign={onAssign}
          onClose={() => setIsAssignOthersOpen(false)}
        />
      ) : (
        <div className="flex gap-4 items-center  border rounded-lg border-borderDividers  p-2">
          {/* {Icon} */}
          <UsersIcon className="size-10 p-2 rounded-full text-primary bg-primary/20 " />
          {/* Text */}
          <div className="flex flex-col gap-1  ">
            <span className="text-primaryText font-semibold text-sm">
              Need someone else?
            </span>
            <span className="text-secondaryText text-xs">
              Assign a student who didn't request this shift.
            </span>
          </div>
          <button
            onClick={() => setIsAssignOthersOpen(true)}
            className="ml-auto mr-2 border border-primary b-2 rounded-xl p-4 hover:cursor-pointer hover:bg-primary hover:text-primaryText text-primary transition-all duration-300 flex flex-row items-center gap-2"
          >
            <UserPlusIcon className="size-4" />
            <span className="text-xs">Assign other students</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AssignOtherStudent;
