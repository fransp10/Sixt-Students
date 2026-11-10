import { ArrowDownTrayIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useMarkPayrollPaid } from "../../../hooks/useMarkPayrollPaid";
import { useUnmarkPayrollPaid } from "../../../hooks/useUnmarkPayrollPaid";
import { exportPayrollCsv } from "../../../helpers/exportPayrollCsv";
import { getErrorMessage } from "../../../helpers/getErrorMessage";
import type { Payroll } from "../../../types/payroll";

function PayrollActions({ payroll }: { payroll: Payroll }) {
  const markPaid = useMarkPayrollPaid();
  const unmarkPaid = useUnmarkPayrollPaid();

  // some students may be paid while others aren't, that can be undone too
  const hasPayments =
    payroll.status === "paid" || payroll.status === "partly_paid";
  // partly paid stays payable, a student may have uploaded a contract since
  const canMarkPaid =
    payroll.status === "ready" || payroll.status === "partly_paid";
  const error = markPaid.error ?? unmarkPaid.error;

  return (
    <div className="flex flex-col gap-2 md:items-end">
      <div className="flex gap-2 [&>button]:flex-1 md:[&>button]:flex-none">
        {hasPayments && (
          <button
            type="button"
            disabled={unmarkPaid.isPending}
            onClick={() => unmarkPaid.mutate(payroll.month)}
            className="h-10 px-2 text-sm font-semibold text-secondaryText cursor-pointer hover:text-primaryText disabled:cursor-not-allowed disabled:opacity-50"
          >
            {unmarkPaid.isPending ? "Saving…" : "Mark as unpaid"}
          </button>
        )}
        <button
          type="button"
          onClick={() => exportPayrollCsv(payroll.month, payroll.rows)}
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-borderDividers px-4 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowDownTrayIcon className="size-4" />
          Export CSV
        </button>
        {canMarkPaid && (
          <button
            type="button"
            disabled={markPaid.isPending}
            onClick={() => markPaid.mutate(payroll.month)}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white cursor-pointer transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckIcon className="size-4" />
            {markPaid.isPending ? "Saving…" : "Mark as paid"}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-danger">
          {getErrorMessage(error, "Couldn't update the payment. Try again.")}
        </p>
      )}
    </div>
  );
}

export default PayrollActions;
