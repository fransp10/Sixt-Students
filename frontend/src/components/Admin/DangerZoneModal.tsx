import { createPortal } from "react-dom";
import type { Student } from "../../types/students";
import { getFullName } from "../../helpers/helpers";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
type DangerZoneModalProps = {
  student: Student | undefined;
  handleCloseDangerZoneModal: () => void;
};
function DangerZoneModal({
  student,
  handleCloseDangerZoneModal,
}: DangerZoneModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleCloseDangerZoneModal();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseDangerZoneModal]);

  return createPortal(
    <div
      onClick={handleCloseDangerZoneModal}
      className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-xs bg-black/20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-lg rounded-xl justify-center h-auto bg-cardBG border border-borderDividers text-primaryText p-6 flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2 ">
          <div className="shrink-0 flex items-center justify-center size-18 bg-red-500/10 rounded-full">
            <UserMinusIcon className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-xl font-bold">Deactivate {getFullName(student)}?</p>
          <p className="text-sm text-secondaryText text-center">
            {getFullName(student)} will no longer be able to sign in or request shifts.
            Existing shift and earnings history will remain available.
          </p>
        </div>
        <div className="flex flex-row   gap-2 justify-end">
          <button
            type="button"
            onClick={handleCloseDangerZoneModal}
            className="py-2 px-8 flex-1 border border-borderDividers rounded-lg hover:cursor-pointer hover:bg-borderDividers transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-3 px-8 flex-1  border border-red-500/20 rounded-lg hover:cursor-pointer hover:bg-red-500 transition-colors text-red-500 hover:text-white"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default DangerZoneModal;
