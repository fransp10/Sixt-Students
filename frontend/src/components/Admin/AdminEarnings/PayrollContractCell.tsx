import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import SendReminderButton from "../AdminContracts/SendReminderButton";
import PayrollRowPayment from "./PayrollRowPayment";
import type { PayrollRow } from "../../../types/payroll";

// the normal case stays quiet, only a missing contract gets colour.
// A student with a contract gets "Mark as paid" where a missing one gets "Remind"
function PayrollContractCell({
  row,
  month,
  canPay,
}: {
  row: PayrollRow;
  month: string;
  canPay: boolean; // false until the month has ended
}) {
  if (row.has_contract) {
    return (
      <div className="flex items-center justify-end  gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-secondaryText">
          <CheckIcon className="size-4 text-success" />
          Uploaded
        </span>
        {canPay && <PayrollRowPayment row={row} month={month} />}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end  gap-3 text-sm">
      <span className="inline-flex items-center gap-1.5 font-semibold text-warning">
        <ExclamationTriangleIcon className="size-4" />
        Missing
      </span>
      <div className="w-28">
        <SendReminderButton
          studentName={`${row.first_name} ${row.last_name}`}
          userId={row.user_id}
          month={month}
        />
      </div>
    </div>
  );
}

export default PayrollContractCell;
