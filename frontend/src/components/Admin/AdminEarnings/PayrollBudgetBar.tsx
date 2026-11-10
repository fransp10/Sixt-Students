import { useState } from "react";
import { formatStat } from "../../../helpers/formatStat";
import ChangePayrollBudgetModal from "./ChangePayrollBudgetModal";
import type { Payroll } from "../../../types/payroll";

// a finished month compares what was earned, the current month what it's expected to end at
function PayrollBudgetBar({
  payroll,
  earned,
}: {
  payroll: Payroll;
  earned: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { budget, scheduled } = payroll;
  const isCurrent = payroll.status === "in_progress";

  const modal = isModalOpen && (
    <ChangePayrollBudgetModal
      month={payroll.month}
      currentBudget={budget}
      onClose={() => setIsModalOpen(false)}
    />
  );

  if (budget === null) {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-borderDividers px-4 py-3 text-sm text-secondaryText">
        <span>Set a monthly budget to see if you're on track.</span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="font-semibold text-primary cursor-pointer hover:underline"
        >
          Set budget
        </button>
        {modal}
      </div>
    );
  }

  const upcoming = isCurrent ? scheduled.amount : 0;
  const expected = earned + upcoming;
  const difference = budget - expected;
  // a bit of room past the larger value so the budget marker never sits on the edge
  const scale = Math.max(expected, budget) * 1.05;
  const toPercent = (value: number) => `${(value / scale) * 100}%`;

  const verdict =
    difference >= 0
      ? `${isCurrent ? "On track, " : ""}${formatStat(difference, "€")} under budget`
      : `${isCurrent ? "Heading " : ""}${formatStat(-difference, "€")} over budget`;

  return (
    <div className="mt-6">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-2 font-semibold text-primaryText">
          <span
            className={`size-2 rounded-full ${difference >= 0 ? "bg-success" : "bg-warning"}`}
          />
          {verdict}
        </span>
        {isCurrent && (
          <span className="text-secondaryText">
            Expected to end at{" "}
            <span className="font-semibold text-primaryText tabular-nums">
              {formatStat(expected, "€")}
            </span>
          </span>
        )}
      </div>

      <div className="relative h-2 rounded-full bg-darkBackground">
        <div
          className="absolute inset-y-0 left-0 rounded-l-full bg-primary"
          style={{ width: toPercent(earned) }}
        />
        {isCurrent && (
          <div
            className="absolute inset-y-0 bg-primary/35"
            style={{ left: toPercent(earned), width: toPercent(upcoming) }}
          />
        )}
        <div
          className="absolute -inset-y-1.5 w-0.5 -translate-x-1/2 rounded-full bg-primaryText"
          style={{ left: toPercent(budget) }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-secondaryText">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-primary" />
          Worked
        </span>
        {isCurrent && (
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary/35" />
            Scheduled, {scheduled.shifts}{" "}
            {scheduled.shifts === 1 ? "shift" : "shifts"}
          </span>
        )}
        <span className="flex items-center gap-2">
          <span className="h-3 w-0.5 rounded-full bg-primaryText" />
          Budget {formatStat(budget, "€")}
        </span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="ml-auto font-semibold cursor-pointer hover:text-primaryText"
        >
          Change budget
        </button>
      </div>
      {modal}
    </div>
  );
}

export default PayrollBudgetBar;
