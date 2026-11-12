import { XMarkIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";
import type { UserWithoutPassword } from "../../types/user";
import { useState } from "react";
import { isValidEmail } from "../../helpers/isValidEmail";
import { useSendPasswordResetEmail } from "../../hooks/useSendPasswordResetEmail";
import LoadingSpinner from "../LoadingSpinner";
import SuccessView from "../SuccessView";
import ErrorView from "../ErrorView";

function ResetPasswordModal({
  handleClose,
  student,
}: {
  student: UserWithoutPassword;
  handleClose: () => void;
}) {
  const [email, setEmail] = useState(student.email ?? "");
  const [isChangingMail, setIsChangingMail] = useState(true);
  const validEmail = isValidEmail(email);
  const {
    mutate: sendPasswordResetEmail,
    isSuccess,
    isPending,
    isError,
  } = useSendPasswordResetEmail();

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      {isSuccess && (
        <SuccessView
          heading="Email successfully sent"
          message={`A password reset link has been sent to ${email}.`}
          handleCloseModal={handleClose}
        />
      )}
      {isError && (
        <ErrorView
          handleCloseModal={handleClose}
          heading="Error while sending email"
          message="There was an error while sending the password reset email. Please try again later."
        />
      )}
      {isPending && (
        <div className="flex flex-col items-center justify-center gap-4 py-10 px-6 h-82">
          <LoadingSpinner />
        </div>
      )}
      {!isSuccess && !isError && !isPending && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg bg-cardBG p-4 relative flex flex-col gap-4 w-full max-w-md"
        >
          <h2 className="text-lg font-medium text-primaryText">
            Reset password{" "}
          </h2>
          <p className="text-sm text-secondaryText">
            Are you sure you want to reset the password for this student?
          </p>
          <form>
            <label className="flex flex-col gap-2">
              <span className="text-secondaryText text-sm">
                Email to send the reset link to
              </span>
              <div className="flex gap-2">
                <input
                  disabled={isChangingMail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 w-full text-primaryText outline-none border border-borderDividers rounded-lg px-4 py-2 text-sm focus:border-pending disabled:bg-cardLighterBG disabled:text-secondaryText disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsChangingMail((prev) => !prev);
                  }}
                  className={` text-primaryText cursor-pointer px-2 w-20 py-1 text-sm rounded-lg  ${isChangingMail ? `bg-studentCard` : `bg-primary`}`}
                >
                  {isChangingMail ? "Change" : "Save"}
                </button>
              </div>
            </label>
          </form>
          {!validEmail && (
            <p className="text-xs text-danger -mt-2">
              Please enter a valid email address.
            </p>
          )}
          {!isChangingMail && (
            <p className="text-xs text-secondaryText -mt-2">
              Please make sure to save the email before sending the reset link.
            </p>
          )}
          <button
            disabled={!validEmail || !isChangingMail}
            onClick={() => {
              sendPasswordResetEmail({ userId: String(student.id), email });
            }}
            type="button"
            className="bg-primary text-primaryText w-full h-12 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors cursor-pointer disabled:bg-surfaceCards/50 disabled:text-secondaryText disabled:cursor-not-allowed"
          >
            Send Reset password link
          </button>
        </div>
      )}
      <button
        className="p-1 bg-cardLighterBG cursor-pointer text-surfaceCards hover:text-danger absolute top-2 right-2 rounded-lg"
        onClick={handleClose}
      >
        <XMarkIcon className="size-6 " />
      </button>
    </div>,
    document.body,
  );
}

export default ResetPasswordModal;
