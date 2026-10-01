import { useEffect, useState, type KeyboardEvent } from "react";
import { useUpdateMyInfo } from "../../../hooks/useUpdateMyInfo";
import { getErrorMessage } from "../../../helpers/getErrorMessage";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../../LoadingSpinner";

function ContactField({
  field,
  label,
  type,
  value,
}: {
  field: "email" | "phone";
  label: string;
  type: string;
  value: string;
}) {
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const updateMyInfo = useUpdateMyInfo();

  const isEditing = draftValue !== null;
  const isSaving = updateMyInfo.isPending;
  const isError = updateMyInfo.isError;
  const { isSuccess } = updateMyInfo;

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleUpdate();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  function handleUpdate() {
    updateMyInfo.mutate(
      { [field]: draftValue },
      {
        onSuccess: () => {
          handleSuccess();
        },
      },
    );
  }

  function handleCancel() {
    setDraftValue(null);
    if (isError) {
      updateMyInfo.reset();
    }
  }

  function handleSuccess() {
    setDraftValue(null);
  }

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => updateMyInfo.reset(), 3000);
    return () => clearTimeout(timer);
  }, [isSuccess, updateMyInfo]);

  return (
    <div
      className={`flex flex-row gap-4 p-4 rounded-lg  justify-between ${isEditing ? "bg-headersCalendar border border-borderDividers" : ""}`}
    >
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-secondaryText">
          Used for important notifications about your work.
        </p>
      </div>
      {!isEditing && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="font-semibold">{value}</span>
          {updateMyInfo.isSuccess && (
            <p className="text-sm text-success">Saved</p>
          )}
          <button
            onClick={() => setDraftValue(value ?? "")}
            className="text-sm text-primaryText font-semibold cursor-pointer bg-cardBG p-3 rounded-lg"
          >
            Change
          </button>
        </div>
      )}

      {isEditing && (
        <div className="flex gap-2 md:flex-col">
          <div className=" w-92 bg-cardBG border p-2 border-borderDividers focus-within:border-pending   rounded-lg group">
            <input
              autoFocus
              className="ml-2 w-full font-semibold text-lg outline-none  "
              value={draftValue}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder={value}
              type={type}
              onChange={(e) => setDraftValue(e.target.value)}
            />
          </div>

          {isError ? (
            <p className="text-xs text-danger flex items-center gap-1">
              <ExclamationCircleIcon className="inline size-4" />
              {getErrorMessage(updateMyInfo.error)}
            </p>
          ) : (
            <p className="text-sm text-secondaryText">
              Enter to save · Esc to cancel
            </p>
          )}

          <div className="flex flex-row gap-2 justify-end">
            <button
              onClick={() => handleCancel()}
              className="text-sm h-12 w-20 text-primaryText font-semibold cursor-pointer border border-borderDividers p-3 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={() => handleUpdate()}
              disabled={draftValue.trim() === value || isSaving}
              className="text-sm h-12 w-20 text-primaryText font-semibold cursor-pointer bg-primary p-3 rounded-lg disabled:bg-primary/50 disabled:text-primaryText/50 disabled:cursor-not-allowed"
            >
              <span>{isSaving ? <LoadingSpinner size={24} /> : "Save"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactField;
