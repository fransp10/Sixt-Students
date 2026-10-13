import { Link, useSearchParams } from "react-router-dom";
import sixtStudentsLogo from "../assets/sixtStudentsLogo.png";
import PasswordInput from "../components/student/ChangePassword/PasswordInput";
import { useState } from "react";
import { isPasswordRequirementsMet } from "../helpers/passwordRequirments";
import PasswordRequirements from "../components/PasswordRequirements";
import {
  useResetPassword,
  useValidateResetToken,
} from "../hooks/useResetPassword";
import FullPageSpinner from "./FullPageSpinner";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/LoadingSpinner";
import { isAxiosError } from "axios";
import LinkMessage from "../components/LinkMessage";

// A 400 from the reset endpoints means the link itself is bad (missing, expired or already used)
function isBadRequest(error: unknown) {
  return isAxiosError(error) && error.response?.status === 400;
}

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = searchParams.get("token");

  const { isRequirementsMet, requirements } = isPasswordRequirementsMet(
    password,
    "reset",
    confirmPassword,
  );
  const {
    data: isTokenValid,
    isLoading,
    isError,
    error: validateError,
  } = useValidateResetToken(token as string);
  const {
    mutate: resetPassword,
    isSuccess,
    isError: isResetError,
    isPending: isResettingPassword,
    error: resetError,
  } = useResetPassword();

  if (token && isLoading) return <FullPageSpinner />;

  // Validation request itself failed (server down, 500) - the link might still be fine
  if (isError && !isBadRequest(validateError)) {
    return (
      <LinkMessage
        title="Something went wrong"
        subtitle="Please refresh the page or try again later."
      />
    );
  }

  if (
    !token ||
    isError ||
    !isTokenValid?.ok ||
    (isResetError && isBadRequest(resetError))
  ) {
    return (
      <LinkMessage
        title="Invalid link"
        subtitle="Ask your admin for a new one."
      />
    );
  }

  return (
    <div className="bg-pageBackground h-screen text-primaryText flex flex-col items-center justify-center ">
      <div className="flex border border-borderDividers bg-cardBG rounded-lg flex-col p-4 items-center">
        <img src={sixtStudentsLogo} className="h-26 xs:h-42 sm:h-48" />
        {isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircleIcon className="h-20 w-20 p-2 text-success bg-success/10 rounded-full" />
            <h1 className="font-bold text-xl">Password reset successfully</h1>
            <p className="text-secondaryText">
              You may now login using your new password
            </p>
            <Link
              className="bg-primary w-42 py-4 mt-4 text-center rounded-lg cursor-pointer text-sm font-semibold hover:bg-primary/80 transition-colors"
              to="/login"
            >
              Go to login
            </Link>
          </div>
        )}
        {!isSuccess && (
          <>
            <h1 className="text-xl font-bold">Reset password</h1>
            <p className="text-base text-secondaryText font-semibold">
              Set your new password here
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                resetPassword({ token: token, newPassword: password });
              }}
              className="flex flex-col gap-4 mt-8 w-full"
            >
              <PasswordInput
                label="New password"
                setValue={setPassword}
                placeholder="Type your new password"
              />
              <PasswordInput
                label="Confirm password"
                setValue={setConfirmPassword}
                placeholder="Confirm your new password"
              />
              <PasswordRequirements requirements={requirements} />
              {isResetError && (
                <p className="text-sm text-danger">
                  Couldn't reset your password. Please try again.
                </p>
              )}
              <button
                disabled={
                  !isRequirementsMet ||
                  password !== confirmPassword ||
                  isResettingPassword
                }
                type="submit"
                className="mt-8 bg-primary w-full h-14 rounded-lg text-sm font-semibold cursor-pointer hover:bg-primary/80 transition-colors disabled:bg-studentCard disabled:cursor-not-allowed disabled:text-secondaryText"
              >
                {isResettingPassword ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner />
                  </div>
                ) : (
                  "Change password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
