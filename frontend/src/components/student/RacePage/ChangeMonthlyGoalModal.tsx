import { useEffect, useState, type SubmitEvent } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { FlagIcon } from "@heroicons/react/24/outline";
import { useUpdateMyGoal } from "../../../hooks/useUpdateMyGoal";
import { MONTHLY_GOAL_PRESETS } from "../../../helpers/constants";

function ChangeMonthlyGoalModal({
  onClose,
  currentGoal,
}: {
  onClose: () => void;
  currentGoal: number;
}) {
  const [value, setValue] = useState(String(currentGoal));
  const { mutate: saveGoal, isPending, isError } = useUpdateMyGoal();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const amount = Number(value);
  const isValid = value !== "" && Number.isFinite(amount) && amount > 0;
  const isUnchanged = amount === currentGoal;
  const monthName = format(new Date(), "MMMM");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!isValid || isUnchanged) return;
    saveGoal(amount, { onSuccess: onClose });
  }

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="mx-4 flex w-full max-w-sm flex-col gap-6 rounded-xl border border-borderDividers bg-cardBG p-6 text-primaryText"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <FlagIcon className="size-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Set your {monthName} goal</h2>
          <p className="text-sm text-secondaryText">
            Your goal carries over to the next months until you change it.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="goal-amount"
            className="text-sm font-semibold text-secondaryText"
          >
            Goal amount
          </label>
          <div className="flex items-center rounded-lg border border-borderDividers bg-pageBackground px-4 transition-colors focus-within:border-primary">
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-14 w-full bg-transparent text-3xl font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-2xl font-semibold text-secondaryText">€</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {MONTHLY_GOAL_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setValue(String(preset))}
                className={`rounded-lg border py-2 text-sm font-semibold transition-colors cursor-pointer ${
                  amount === preset
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-borderDividers text-secondaryText hover:bg-borderDividers hover:text-primaryText"
                }`}
              >
                {preset}€
              </button>
            ))}
          </div>

          <p className="text-xs text-secondaryText">
            Current goal:{" "}
            <span className="text-primaryText">{currentGoal}€</span>
          </p>
          {!isValid && value !== "" && (
            <p className="text-sm text-danger">Enter an amount above 0.</p>
          )}
          {isError && (
            <p className="text-sm text-danger">
              Couldn't save your goal. Try again.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-borderDividers py-3 font-semibold transition-colors hover:bg-borderDividers cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isUnchanged || isPending}
            className="flex-1 rounded-lg bg-primary py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {isPending ? "Saving…" : "Save goal"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

export default ChangeMonthlyGoalModal;
