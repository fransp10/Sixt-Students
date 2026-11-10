import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import SendReminderButton from "../AdminContracts/SendReminderButton";
import type { PayrollRow } from "../../../types/payroll";

// the normal case stays quiet, only a missing contract gets colour
function PayrollContractCell({
  row,
  month,
}: {
  row: PayrollRow;
  month: string;
}) {
  if (row.has_contract) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-secondaryText">
        <CheckIcon className="size-4 text-success" />
        Uploaded
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
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
