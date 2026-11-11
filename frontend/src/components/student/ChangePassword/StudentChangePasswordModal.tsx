import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import PasswordInput from "./PasswordInput";
import { useChangeMyPassword } from "../../../hooks/useChangeMyPassword";
import { getErrorMessage } from "../../../helpers/getErrorMessage";
import LoadingSpinner from "../../LoadingSpinner";
import { isPasswordRequirementsMet } from "../../../helpers/passwordRequirments";
import PasswordRequirements from "../../PasswordRequirements";
import SuccessView from "../../SuccessView";
import SettingsCardHeader from "../SettingsCardHeader";

function StudentChangePasswordModal({
  handleCloseModal,
}: {
  handleCloseModal: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const {
    mutate: changePassword,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  } = useChangeMyPassword();

  const { isRequirementsMet, requirements } = isPasswordRequirementsMet(
    newPassword,
    "change",
    confirmNewPassword,
    currentPassword,
  );
  const canSubmit = isRequirementsMet && currentPassword !== "" && !isPending;

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    changePassword({ currentPassword, newPassword });
  }

  function handleCurrentPasswordChange(value: string) {
    setCurrentPassword(value);
    if (isError) reset();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) handleCloseModal();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseModal, isPending]);

  let errorMessage: string | null = null;
  if (isError) {
    errorMessage = getErrorMessage(error, "Failed to change password");
  }

  return (
    <div
      // mousedown, so dragging a text selection out of an input doesn't close the modal
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isPending) handleCloseModal();
      }}
      // m-auto on the child centers it, but still lets it scroll on short screens
      className="fixed inset-0 z-50 flex overflow-y-auto bg-black/50 p-4"
    >
      {isSuccess ? (
        <div className="m-auto flex w-full max-w-md">
          <SuccessView
            heading="Password updated"
            message="Use your new password the next time you sign in."
            handleCloseModal={handleCloseModal}
          />
        </div>
      ) : (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-password-heading"
          className="relative m-auto w-full max-w-lg rounded-xl border border-borderDividers bg-cardBG text-primaryText"
        >
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isPending}
            aria-label="Close"
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-icons cursor-pointer transition-colors hover:bg-cardLighterBG hover:text-primaryText disabled:cursor-not-allowed"
          >
            <XMarkIcon className="size-5" />
          </button>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
            <div className="pr-8">
              <SettingsCardHeader
                id="change-password-heading"
                icon={LockClosedIcon}
                title="Change your password"
                subtitle="Enter your current password, then choose a new one."
              />
            </div>

            <PasswordInput
              label="Current password"
              placeholder="Your current password"
              autoComplete="current-password"
              autoFocus
              setValue={handleCurrentPasswordChange}
              error={errorMessage}
            />

            <hr className="border-borderDividers" />

            <PasswordInput
              label="New password"
              placeholder="At least 8 characters"
              setValue={setNewPassword}
            />
            <PasswordInput
              label="Confirm new password"
              placeholder="Type the new password again"
              setValue={setConfirmNewPassword}
            />

            <div className="rounded-lg bg-cardLighterBG p-3">
              <PasswordRequirements requirements={requirements} />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isPending}
                className="flex min-h-9 items-center justify-center rounded-lg border border-borderDividers px-4 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:bg-cardLighterBG disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-primary/50 disabled:text-primaryText/50 sm:w-40"
              >
                {isPending ? <LoadingSpinner size={16} /> : "Change password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default StudentChangePasswordModal;
