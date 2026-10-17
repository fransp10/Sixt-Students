import { XMarkIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";
import CreateStudentInput from "./CreateStudentInput";
import { useEffect, useState } from "react";
import CreateStudentDateInput from "./CreateStudentDateInput";
import CreateStudentInputRadtioButton from "./CreateStudentInputRadtioButton";
import { useCreateUser } from "../../../hooks/useCreateUser";
import SuccessView from "../../SuccessView";
import {
  hasErrors,
  INITIAL_FORM_VALUES,
  toRequestBody,
  validateForm,
  type CreateUserFormValues,
} from "./createUserForm";
import CredentialRow from "./CredentialRow";
import { isAxiosError } from "axios";
import { getErrorMessage } from "../../../helpers/getErrorMessage";
type CreateStudentModalProps = {
  handleCloseModal: () => void;
};

function CreateStudentModal({ handleCloseModal }: CreateStudentModalProps) {
  const [newUserData, setNewUserData] =
    useState<CreateUserFormValues>(INITIAL_FORM_VALUES);
  const [showError, setShowError] = useState(false);
  const {
    mutate: createUser,
    isError,
    error,
    isSuccess,
    isPending,
    data: createdUser,
    reset,
  } = useCreateUser();

  const isEmailTaken = isAxiosError(error) && error.response?.status === 409;
  const generalError =
    isError && !isEmailTaken ? getErrorMessage(error) : undefined;

  function handleCreateStudent() {
    setShowError(true);
    if (hasErrors(errors)) return;
    createUser(toRequestBody(newUserData));
  }

  function setField<K extends keyof CreateUserFormValues>(
    field: K,
    value: CreateUserFormValues[K],
  ) {
    setNewUserData((prev) => ({ ...prev, [field]: value }));
    if (isError) reset();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === `Escape`) {
        handleCloseModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseModal]);

  const errors = validateForm(newUserData);

  return createPortal(
    <div
      // Only close when the dark backdrop itself is clicked, not something inside the modal
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseModal();
      }}
      className="fixed flex items-center justify-center inset-0 bg-black/60"
    >
      {isSuccess && createdUser && (
        <SuccessView
          handleCloseModal={handleCloseModal}
          heading="User successfully created"
          message={
            createdUser.password
              ? "Share these login details with the user. The password won't be shown again."
              : createdUser.emailSent
                ? `A setup link was sent to ${createdUser.email}.`
                : "The user was created, but the email couldn't be sent. Use Reset password to send it again."
          }
        >
          <div className="flex w-full flex-col gap-2">
            <CredentialRow label="Username" value={createdUser.username} />
            {createdUser.password && (
              <CredentialRow
                label="Temporary password"
                value={createdUser.password}
              />
            )}
          </div>
        </SuccessView>
      )}
      {!isSuccess && (
        <div className=" bg-cardBG p-4 border border-borderDividers rounded-lg text-primaryText relative">
          <div className="overflow-y-auto scrollbar-thin">
            <h1 className="text-xl font-semibold">Add a student</h1>
            <h2 className="text-sm font-semibold text-secondaryText">
              They can request shifts as soon as they sign in.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <CreateStudentInput
                required={true}
                label="First name"
                placeholder="Fran"
                value={newUserData.first_name}
                setter={(value) => setField("first_name", value)}
                error={showError ? errors.first_name : undefined}
              />
              <CreateStudentInput
                required={true}
                label="Last name"
                placeholder="Sipek"
                value={newUserData.last_name}
                setter={(value) => setField("last_name", value)}
                error={showError ? errors.last_name : undefined}
              />

              <CreateStudentInput
                required={newUserData.user_role === "admin" ? false : true}
                label={`Hourly rate ${newUserData.user_role === "admin" ? "(optional)" : "(required)"}`}
                placeholder="8.56"
                value={newUserData.default_hourly_rate}
                setter={(value) => setField("default_hourly_rate", value)}
                error={showError ? errors.default_hourly_rate : undefined}
              />

              <CreateStudentDateInput
                required={true}
                label={`Date of birth (required)`}
                onChange={(dob) => setField("date_of_birth", dob)}
                value={newUserData.date_of_birth}
                error={showError ? errors.date_of_birth : undefined}
              />
              <CreateStudentInput
                required={newUserData.signin_option === "email"}
                label={`Email ${newUserData.signin_option === "email" ? "(required)" : "(optional)"}`}
                style={`col-span-full`}
                placeholder="fran.sipek@example.com"
                value={newUserData.email}
                setter={(value) => setField("email", value)}
                error={
                  (showError ? errors.email : undefined) ??
                  (isEmailTaken ? getErrorMessage(error) : undefined)
                }
              />
              <div className="col-span-full flex flex-col gap-2">
                <h2 className="text-sm font-semibold">Role for the new user</h2>
                <div className="flex flex-col md:flex-row gap-2">
                  <CreateStudentInputRadtioButton
                    label="Student"
                    onSelect={() => setField("user_role", "student")}
                    selected={newUserData.user_role === "student"}
                    disabled={newUserData.user_role === "student"}
                  />
                  <CreateStudentInputRadtioButton
                    label="Admin"
                    onSelect={() => setField("user_role", "admin")}
                    selected={newUserData.user_role === "admin"}
                    disabled={newUserData.user_role === "admin"}
                  />
                </div>
              </div>
            </div>

            <h2 className="text-sm font-semibold mt-2">First sign-in option</h2>
            <div className="flex flex-col md:flex-row gap-2 col-span-full mt-2">
              <CreateStudentInputRadtioButton
                label="Email setup link"
                onSelect={() => setField("signin_option", "email")}
                selected={newUserData.signin_option === "email"}
                disabled={newUserData.signin_option === "email"}
              />
              <CreateStudentInputRadtioButton
                label="Temporary password"
                onSelect={() => setField("signin_option", "tempPassword")}
                selected={newUserData.signin_option === "tempPassword"}
                disabled={newUserData.signin_option === "tempPassword"}
              />
            </div>
            {generalError && (
              <p className="mt-4 text-sm text-danger">{generalError}</p>
            )}
            <button
              // Not disabled on validation errors - clicking is what reveals them
              disabled={isPending}
              onClick={handleCreateStudent}
              className="w-full mt-4 rounded-lg p-4 bg-primary cursor-pointer hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-cardLighterBG text-white text-sm font-semibold"
            >
              {isPending ? "Creating..." : "Create new user"}
            </button>

            {/* CLOSE MODAL BUTTON */}
            <button
              className="absolute right-3 top-3  bg-cardLighterBG text-surfaceCards rounded-lg  transition-colors cursor-pointer hover:text-danger"
              onClick={handleCloseModal}
            >
              <XMarkIcon className="size-8 p-2" />
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}

export default CreateStudentModal;
