import { createPortal } from "react-dom";
import type { Student } from "../../types/students";
import { getFullName } from "../../helpers/helpers";
import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useDeactivateUser } from "../../hooks/useDeactivateUser";
import { useActivateUser } from "../../hooks/useActivateUser";
import ErrorView from "../ErrorView";
import SuccessView from "../SuccessView";
type DangerZoneModalProps = {
  student: Student;
  handleCloseDangerZoneModal: () => void;
  mode: "activate" | "deactivate";
};
function DangerZoneModal({
  student,
  handleCloseDangerZoneModal,
  mode,
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

  // Both hooks must be called on every render; we just use the one that matches the mode
  const deactivateMutation = useDeactivateUser();
  const activateMutation = useActivateUser();
  const { mutate, status } =
    mode === "deactivate" ? deactivateMutation : activateMutation;

  const isDeactivate = mode === "deactivate";
  const fullName = getFullName(student);

  return createPortal(
    <div
      onClick={handleCloseDangerZoneModal}
      className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-xs bg-black/20"
    >
      {status === "success" && (
        <SuccessView
          heading={`Successfully ${mode}d user`}
          handleCloseModal={handleCloseDangerZoneModal}
          message="Go back to the user's page"
        />
      )}

      {status === "error" && (
        <ErrorView
          handleCloseModal={handleCloseDangerZoneModal}
          heading={`Error while trying to ${mode}`}
          message="Return and try again"
        />
      )}

      {(status === "idle" || status === "pending") && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mx-4 w-full max-w-lg rounded-xl justify-center h-auto bg-cardBG border border-borderDividers text-primaryText p-6 flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 ">
            <div
              className={`shrink-0 flex items-center justify-center size-18 rounded-full ${
                isDeactivate ? "bg-red-500/10" : "bg-success/10"
              }`}
            >
              {isDeactivate ? (
                <UserMinusIcon className="w-12 h-12 text-red-500" />
              ) : (
                <UserPlusIcon className="w-12 h-12 text-success" />
              )}
            </div>
            <p className="text-xl font-bold">
              {isDeactivate ? "Deactivate" : "Activate"} {fullName}?
            </p>
            <p className="text-sm text-secondaryText text-center">
              {isDeactivate
                ? `${fullName} will no longer be able to sign in or request shifts. Existing shift and earnings history will remain available.`
                : `${fullName} will be able to sign in and request shifts again.`}
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
              disabled={status === "pending"}
              onClick={() => mutate(student.id)}
              className={`py-3 px-8 flex-1 border rounded-lg hover:cursor-pointer transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                isDeactivate
                  ? "border-red-500/20 text-red-500 hover:bg-red-500"
                  : "border-success/20 text-success hover:bg-success"
              }`}
            >
              {isDeactivate ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}

export default DangerZoneModal;
