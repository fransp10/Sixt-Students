import { BriefcaseIcon } from "@heroicons/react/24/outline";
import type { Student } from "../types/students";
import { useEffect, useState } from "react";
import { useUpdateUserHourlyRate } from "../hooks/useUpdateUserHourlyRate";
import LoadingSpinner from "./LoadingSpinner";

function WorkSettingsCard({ student }: { student: Student }) {
  const [editing, setEditing] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<string>(
    String(student.default_hourly_rate),
  );
  const parsed = parseFloat(hourlyRate);
  const {
    mutate: changeHourlyRate,
    isError,
    isPending,
    isSuccess,
    reset,
  } = useUpdateUserHourlyRate();
  const isHourlyRateDifferent =
    Number.isFinite(parsed) &&
    parsed > 0 &&
    parsed !== Number(student.default_hourly_rate);

  useEffect(() => {
    if (!isSuccess && !isError) return;
    const timer = setTimeout(reset, 2500);
    return () => clearTimeout(timer);
  }, [isSuccess, isError, reset]);

  function handleConfirm() {
    setEditing(false);
    changeHourlyRate({
      userId: student.id,
      hourlyRate: parseFloat(hourlyRate),
    });
  }

  function handelChangeHourlyRate(e: React.ChangeEvent<HTMLInputElement>) {
    if (!/^\d*\.?\d*$/.test(e.target.value)) {
      return; // Prevent non-numeric input
    }
    setHourlyRate(e.target.value);
  }

  return (
    <div className="flex flex-1  flex-col bg-cardBG rounded-lg p-4 gap-4">
      <div className="flex   items-center gap-4  ">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-icons/20">
          <BriefcaseIcon className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-md">Work settings</h2>
          <p className="text-xs text-secondaryText">
            Employment configuration.
          </p>
        </div>
      </div>
      <div
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-center 
          sm:justify-between border-b border-borderDividers pb-4"
      >
        <div>
          <p className="font-medium text-primaryText">Hourly rate</p>
          <p className="mt-1 text-sm text-secondaryText">
            Set the student's hourly rate.
          </p>
        </div>
        <div className=" w-full sm:w-42">
          <div className="relative flex gap-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-secondaryText">
              €
            </span>
            <input
              onChange={(e) => handelChangeHourlyRate(e)}
              value={hourlyRate}
              disabled={!editing}
              className=" w-full rounded-lg border border-borderDividers bg-cardLighterBG py-2 pl-8 pr-3 text-sm text-primaryText outline-none transition-colors focus:border-primary
              disabled:cursor-not-allowed disabled:bg-cardBG disabled:text-secondaryText disabled:opacity-50"
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (editing) {
                  setHourlyRate(String(student.default_hourly_rate));
                }
                setEditing(!editing);
              }}
              className={`py-1 w-42 text-xs rounded-lg cursor-pointer  transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                editing
                  ? "bg-primary text-white hover:bg-primary/80"
                  : "bg-studentCard text-primaryText hover:bg-cardLighterBG"
              }`}
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>
          {editing && (
            <button
              disabled={!isHourlyRateDifferent}
              onClick={handleConfirm}
              className="bg-cardLighterBG w-full rounded-lg py-1 mt-3 cursor-pointer text-sm text-primaryText transition-colors hover:bg-cardLighterBG/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm
            </button>
          )}

          <div className="mt-2 flex h-4 items-center gap-2 text-xs">
            {isPending && (
              <>
                <LoadingSpinner size={16} />
                <span className="text-secondaryText">Saving...</span>
              </>
            )}
            {isError && (
              <span className="text-danger">
                Couldn't update. Please try again.
              </span>
            )}
            {isSuccess && (
              <span className="text-success">Hourly rate updated</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4  sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-primaryText">Student/Employee ID</p>
        </div>
        <input
          type="text"
          disabled
          defaultValue={student?.id}
          className=" cursor-not-allowed opacity-50 w-full rounded-lg border border-borderDividers bg-cardLighterBG px-4 py-2 text-sm text-primaryText outline-none transition-colors focus:border-primary sm:w-32"
        />
      </div>
    </div>
  );
}

export default WorkSettingsCard;
