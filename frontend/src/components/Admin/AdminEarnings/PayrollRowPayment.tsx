import { format, parseISO } from "date-fns";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useMarkStudentPaid } from "../../../hooks/useMarkStudentPaid";
import { useUnmarkStudentPaid } from "../../../hooks/useUnmarkStudentPaid";
import { getErrorMessage } from "../../../helpers/getErrorMessage";
import type { PayrollRow } from "../../../types/payroll";

// only for students with a contract, they are the only ones who can be paid
function PayrollRowPayment({ row, month }: { row: PayrollRow; month: string }) {
  const markPaid = useMarkStudentPaid();
  const unmarkPaid = useUnmarkStudentPaid();

  if (row.paid_at) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5 text-sm text-secondaryText">
          <CheckIcon className="size-4 text-success" />
          Paid {format(parseISO(row.paid_at), "d MMM")}
        </span>
        <button
          type="button"
          disabled={unmarkPaid.isPending}
          onClick={() => unmarkPaid.mutate({ month, userId: row.user_id })}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-borderDividers px-3 text-xs font-semibold text-secondaryText cursor-pointer transition-colors hover:border-primary hover:text-primaryText disabled:cursor-not-allowed disabled:opacity-50"
        >
          {unmarkPaid.isPending ? "Saving…" : "Mark as unpaid"}
        </button>
        {unmarkPaid.error && (
          <p className="w-full text-xs text-danger">
            {getErrorMessage(unmarkPaid.error, "Couldn't mark as unpaid.")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-32">
      <button
        type="button"
        disabled={markPaid.isPending}
        onClick={() => markPaid.mutate({ month, userId: row.user_id })}
        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-borderDividers px-3 text-xs font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CheckIcon className="size-4" />
        {markPaid.isPending ? "Saving…" : "Mark as paid"}
      </button>
      {markPaid.error && (
        <p className="mt-1 text-xs text-danger">
          {getErrorMessage(markPaid.error, "Couldn't mark as paid.")}
        </p>
      )}
    </div>
  );
}

export default PayrollRowPayment;
