import { KeyIcon } from "@heroicons/react/24/outline";
import type { Student } from "../types/students";
import { getFullName } from "../helpers/helpers";
import { useState } from "react";
import ResetPasswordModal from "./Admin/ResetPasswordModal";

function AccountAccesSettingsCard({ student }: { student: Student }) {
  console.log("student", student);

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  return (
    <div className="flex flex-1 flex-col bg-cardLighterBG rounded-lg p-4 gap-4">
      <div className="flex  items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-icons/20">
          <KeyIcon className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-md">Account access</h2>
          <p className="text-xs text-secondaryText">
            Manage access to the application.
          </p>
        </div>
      </div>
      <div
        className="flex  flex-col gap-3 sm:flex-row sm:items-center 
          sm:justify-between border-b border-borderDividers pb-4"
      >
        <div>
          <p className="font-medium text-primaryText">Username</p>
          <p className="mt-1 text-sm text-secondaryText">
            Username used to sign in with
          </p>
        </div>
        <input
          id="username"
          inputMode="text"
          disabled
          value={student?.username ?? ""}
          className="w-full rounded-lg border border-borderDividers bg-cardLighterBG px-4 py-2 text-sm text-secondaryText sm:w-32"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-4  sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-primaryText">Password</p>
          <p className="mt-1 text-sm text-secondaryText ">
            Send {getFullName(student)} a password reset link to their email
            address.
          </p>
        </div>
        <button
          onClick={() => setIsResetPasswordModalOpen(true)}
          className="w-full rounded-lg border border-borderDividers bg-cardLighterBG 
                px-4 py-2 text-sm font-medium text-secondaryText transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primaryText sm:w-auto text-nowrap cursor-pointer"
        >
          Reset password
        </button>
      </div>
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          student={student}
          handleClose={() => setIsResetPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}

export default AccountAccesSettingsCard;
