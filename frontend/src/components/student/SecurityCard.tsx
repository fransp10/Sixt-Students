import { KeyIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import StudentChangePasswordModal from "./ChangePassword/StudentChangePasswordModal";
import SettingsCardHeader from "./SettingsCardHeader";
import SettingsRow from "./SettingsRow";

function SecurityCard() {
  const { currentUser } = useAuthContext();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const changePasswordButtonRef = useRef<HTMLButtonElement>(null);

  function handleCloseModal() {
    setIsChangePasswordModalOpen(false);
    changePasswordButtonRef.current?.focus();
  }

  return (
    <section className="rounded-xl border border-borderDividers bg-cardBG p-5">
      <SettingsCardHeader
        id="signin-heading"
        icon={KeyIcon}
        title="Signing in"
        subtitle="What you use to log in to the app."
      />
      <div className="mt-2 divide-y divide-borderDividers">
        <SettingsRow
          label="Username"
          description="Type this, not your email, when you sign in."
          value={
            <p className="truncate text-sm text-primaryText">
              {currentUser?.username}
            </p>
          }
          action={
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-secondaryText">
              <LockClosedIcon className="size-4 text-icons" />
              Set by your admin
            </span>
          }
        />
        <SettingsRow
          label="Password"
          description="Change it if you think someone else knows it."
          value={
            <p
              aria-hidden="true"
              className="text-sm tracking-widest text-secondaryText"
            >
              ••••••••••
            </p>
          }
          action={
            <button
              ref={changePasswordButtonRef}
              type="button"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary"
            >
              Change password
            </button>
          }
        />
      </div>
      {isChangePasswordModalOpen && (
        <StudentChangePasswordModal handleCloseModal={handleCloseModal} />
      )}
    </section>
  );
}

export default SecurityCard;
