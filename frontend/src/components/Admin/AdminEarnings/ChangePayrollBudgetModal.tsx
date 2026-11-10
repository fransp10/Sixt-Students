import { useEffect, useState, type SubmitEvent } from "react";
import { createPortal } from "react-dom";
import { format, parseISO } from "date-fns";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useUpdatePayrollBudget } from "../../../hooks/useUpdatePayrollBudget";
import { formatStat } from "../../../helpers/formatStat";

function ChangePayrollBudgetModal({
  onClose,
  month,
  currentBudget,
}: {
  onClose: () => void;
  month: string; // YYYY-MM
  currentBudget: number | null;
}) {
  const [value, setValue] = useState(
    currentBudget === null ? "" : String(currentBudget),
  );
  const { mutate: saveBudget, isPending, isError } = useUpdatePayrollBudget();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const amount = Number(value);
  const isValid = value !== "" && Number.isFinite(amount) && amount > 0;
  const isUnchanged = amount === currentBudget;
  const monthName = format(parseISO(month), "MMMM");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!isValid || isUnchanged) return;
    saveBudget({ month, amount }, { onSuccess: onClose });
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
            <BanknotesIcon className="size-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Set the {monthName} budget</h2>
          <p className="text-sm text-secondaryText">
            The budget carries over to the next months until you change it.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="budget-amount"
            className="text-sm font-semibold text-secondaryText"
          >
            Monthly budget
          </label>
          <div className="flex items-center rounded-lg border border-borderDividers bg-pageBackground px-4 transition-colors focus-within:border-primary">
            <input
              id="budget-amount"
              autoFocus
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-14 w-full bg-transparent text-3xl font-bold outline-none"
            />
            <span className="text-2xl font-semibold text-secondaryText">€</span>
          </div>

          <p className="text-xs text-secondaryText">
            Current budget:{" "}
            <span className="text-primaryText">
              {currentBudget === null
                ? "not set"
                : formatStat(currentBudget, "€")}
            </span>
          </p>
          {!isValid && value !== "" && (
            <p className="text-sm text-danger">Enter an amount above 0.</p>
          )}
          {isError && (
            <p className="text-sm text-danger">
              Couldn't save the budget. Try again.
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
            {isPending ? "Saving…" : "Save budget"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

export default ChangePayrollBudgetModal;
