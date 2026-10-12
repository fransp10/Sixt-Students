import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import PasswordInput from "./PasswordInput";
import { useChangeMyPassword } from "../../../hooks/useChangeMyPassword";
import { getErrorMessage } from "../../../helpers/getErrorMessage";
import LoadingSpinner from "../../LoadingSpinner";
import { isPasswordRequirementsMet } from "../../../helpers/passwordRequirments";
import PasswordRequirements from "../../PasswordRequirements";
import SuccessView from "../../SuccessView";

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

  const isPasswordMatch =
    newPassword === "" ||
    confirmNewPassword === "" ||
    newPassword === confirmNewPassword;

  const { isRequirementsMet, requirements } = isPasswordRequirementsMet(
    newPassword,
    "change",
    currentPassword,
  );

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {},
      },
    );
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleCloseModal();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseModal]);

  let erorrMessage: string | null = null;
  if (isError) {
    erorrMessage = getErrorMessage(error, "Failed to change password");
  }
  return (
    <div
      onClick={handleCloseModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" w-160 bg-cardBG relative rounded-xl  flex flex-col gap-4"
      >
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-xl">
            <LoadingSpinner />
          </div>
        )}
        {isSuccess ? (
          <SuccessView
            heading="Password updated"
            message="Use your new password the next time you sign in."
            handleCloseModal={handleCloseModal}
          />
        ) : (
          <div className="flex flex-col gap-4 p-6">
            {/* HEADER */}
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-xl">
                <LockClosedIcon className="size-6 sm:size-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold ">Change your password</h2>
                <p className="text-base font-semibold text-secondaryText">
                  Enter your current password, then choose a new one.
                </p>
              </div>
            </div>
            {/* INPUTS */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <PasswordInput
                label="Current password"
                placeholder="Your current password"
                setValue={setCurrentPassword}
                onFocus={reset}
              />
              {erorrMessage && (
                <p className="text-xs font-semibold text-danger">
                  {erorrMessage}
                </p>
              )}

              <div className="h-1 w-full bg-cardLighterBG" />
              <div>
                <PasswordInput
                  label="New password"
                  placeholder="Your new password"
                  setValue={setNewPassword}
                />
                <PasswordRequirements requirements={requirements} />
              </div>
              <div>
                <PasswordInput
                  label="Confirm new password"
                  placeholder="Confirm your new password"
                  setValue={setConfirmNewPassword}
                />

                <div
                  className={`${isPasswordMatch ? "opacity-0" : "opacity-100"}`}
                >
                  <p className="mt-1 text-xs font-semibold text-danger">
                    Passwords don't match
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row ml-auto gap-4 mt-2 w-1/2">
                <button
                  disabled={
                    !isPasswordMatch ||
                    !isRequirementsMet ||
                    currentPassword === "" ||
                    isPending
                  }
                  type="submit"
                  onClick={() => handleSubmit}
                  className="p-2  flex-1 sm:w-auto bg-primary cursor-pointer hover:bg-primary/80 rounded-xl text-nowrap disabled:bg-primary/50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCloseModal();
                  }}
                  className="flex-1 border border-borderDividers p-2 sm:w-auto cursor-pointer hover:bg-pageBackground rounded-xl text-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          onClick={() => handleCloseModal()}
          className="p-2 w-full sm:w-auto  cursor-pointer bg-studentCard hover:bg-danger rounded-xl text-nowrap absolute top-4 right-4 text-icons"
        >
          <XMarkIcon className="size-3 sm:size-4 " />
        </button>
      </div>
    </div>
  );
}

export default StudentChangePasswordModal;
