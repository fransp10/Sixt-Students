import { format, parseISO } from "date-fns";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useMarkStudentPaid } from "../../../hooks/useMarkStudentPaid";
import { getErrorMessage } from "../../../helpers/getErrorMessage";
import type { PayrollRow } from "../../../types/payroll";

// only for students with a contract, they are the only ones who can be paid
function PayrollRowPayment({ row, month }: { row: PayrollRow; month: string }) {
  const markPaid = useMarkStudentPaid();

  if (row.paid_at) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-secondaryText">
        <CheckIcon className="size-4 text-success" />
        Paid {format(parseISO(row.paid_at), "d MMM")}
      </span>
    );
  }

  const studentName = `${row.first_name} ${row.last_name}`;

  return (
    <div className="w-32">
      <button
        type="button"
        disabled={markPaid.isPending}
        onClick={() => markPaid.mutate({ month, userId: row.user_id })}
        aria-label={`Mark ${studentName} as paid`}
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
