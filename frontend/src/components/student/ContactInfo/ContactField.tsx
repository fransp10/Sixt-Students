import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useUpdateMyInfo } from "../../../hooks/useUpdateMyInfo";
import { getErrorMessage } from "../../../helpers/getErrorMessage";
import { isValidEmail } from "../../../helpers/isValidEmail";
import { isValidPhone } from "../../../helpers/isValidPhone";
import LoadingSpinner from "../../LoadingSpinner";
import SettingsRow from "../SettingsRow";

export type ContactFieldName = "email" | "phone";

type ContactFieldProps = {
  field: ContactFieldName;
  label: string;
  description: string;
  type: "email" | "tel";
  placeholder: string;
  emptyText: string;
  value: string | null;
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
};

function getValidationError(field: ContactFieldName, value: string) {
  if (field === "email" && !isValidEmail(value)) {
    return "Enter a full email address, like name@example.com.";
  }
  if (field === "phone" && !isValidPhone(value)) {
    return "Enter 6 to 15 digits, with an optional + for the country code.";
  }
  return null;
}

function ContactField({
  field,
  label,
  description,
  type,
  placeholder,
  emptyText,
  value,
  isEditing,
  onEdit,
  onClose,
}: ContactFieldProps) {
  const [draftValue, setDraftValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const updateMyInfo = useUpdateMyInfo();
  // set on Cancel/Save so focus goes back to the Edit button once it's rendered again
  const shouldFocusEditButton = useRef(false);

  const { isSuccess, reset } = updateMyInfo;
  const isSaving = updateMyInfo.isPending;
  const trimmedDraft = draftValue.trim();
  const canSave =
    trimmedDraft !== "" && trimmedDraft !== (value ?? "") && !isSaving;

  let errorMessage = validationError;
  if (!errorMessage && updateMyInfo.isError) {
    errorMessage = getErrorMessage(
      updateMyInfo.error,
      "Couldn't save. Please try again.",
    );
  }

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(reset, 3000);
    return () => clearTimeout(timer);
  }, [isSuccess, reset]);

  function handleEdit() {
    reset();
    setDraftValue(value ?? "");
    setValidationError(null);
    onEdit();
  }

  function handleCancel() {
    reset();
    shouldFocusEditButton.current = true;
    onClose();
  }

  function handleSave() {
    if (!canSave) return;

    const error = getValidationError(field, trimmedDraft);
    if (error) {
      setValidationError(error);
      return;
    }

    updateMyInfo.mutate(
      { [field]: trimmedDraft },
      {
        onSuccess: () => {
          shouldFocusEditButton.current = true;
          onClose();
        },
      },
    );
  }

  function handleChange(newValue: string) {
    setDraftValue(newValue);
    setValidationError(null);
    if (updateMyInfo.isError) reset();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  }

  if (!isEditing) {
    return (
      <SettingsRow
        label={label}
        description={description}
        value={
          <>
            <p
              className={`truncate text-sm ${value ? "text-primaryText" : "text-secondaryText"}`}
            >
              {value || emptyText}
            </p>
            {isSuccess && (
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-success">
                <CheckCircleIcon className="size-4" />
                Saved
              </span>
            )}
          </>
        }
        action={
          <button
            ref={(button) => {
              if (button && shouldFocusEditButton.current) {
                shouldFocusEditButton.current = false;
                button.focus();
              }
            }}
            type="button"
            onClick={handleEdit}
            aria-label={`${value ? "Edit" : "Add"} ${label.toLowerCase()}`}
            className="flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary"
          >
            {value ? (
              <PencilSquareIcon className="size-4" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            {value ? "Edit" : "Add"}
          </button>
        }
      />
    );
  }

  return (
    <div className="py-4 last:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
        <div className="sm:w-52 sm:shrink-0 sm:pt-1">
          <label
            htmlFor={`contact-${field}`}
            className="text-sm font-semibold text-primaryText"
          >
            {label}
          </label>
          <p className="text-xs text-secondaryText">{description}</p>
        </div>

        <div className="min-w-0 flex-1">
          {/* readOnly instead of disabled while saving, so the input keeps focus if the save fails */}
          <input
            id={`contact-${field}`}
            autoFocus
            type={type}
            autoComplete={type}
            placeholder={placeholder}
            value={draftValue}
            readOnly={isSaving}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-invalid={!!errorMessage}
            aria-describedby={`contact-${field}-hint`}
            className={`w-full rounded-lg border bg-cardLighterBG px-3 py-2 text-sm text-primaryText outline-none transition-colors placeholder:text-icons read-only:opacity-50 ${errorMessage ? "border-danger" : "border-borderDividers focus:border-primary"}`}
          />
          <p
            id={`contact-${field}-hint`}
            className={`mt-1.5 flex items-center gap-1 text-xs ${errorMessage ? "text-danger" : "text-secondaryText"}`}
          >
            {errorMessage ? (
              <>
                <ExclamationCircleIcon className="size-4 shrink-0" />
                {errorMessage}
              </>
            ) : (
              "Press Enter to save or Esc to cancel"
            )}
          </p>

          <div className="mt-3 flex gap-2 sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex min-h-9 flex-1 items-center justify-center rounded-lg border border-borderDividers px-4 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:bg-cardLighterBG disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="flex min-h-9 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-primary/50 disabled:text-primaryText/50 sm:w-20 sm:flex-none"
            >
              {isSaving ? <LoadingSpinner size={16} /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactField;
