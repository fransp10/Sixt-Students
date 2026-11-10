import { differenceInCalendarDays, endOfMonth, format, parseISO } from "date-fns";
import type { Payroll } from "../../../types/payroll";

// one neutral pill for every status, only the dot carries colour
function PayrollStatusChip({
  payroll,
  missingCount,
}: {
  payroll: Payroll;
  missingCount: number;
}) {
  const today = new Date();
  const daysLeft = differenceInCalendarDays(endOfMonth(today), today);

  let dot = "bg-primary";
  let text = "Ready to pay";

  if (payroll.status === "paid" && payroll.payment) {
    dot = "bg-success";
    text = `Paid on ${format(parseISO(payroll.payment.paid_at), "d MMM")}`;
  } else if (payroll.status === "in_progress") {
    dot = "bg-pending";
    text =
      daysLeft === 0
        ? "In progress · last day"
        : `In progress · ${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;
  } else if (payroll.status === "waiting_on_contracts") {
    dot = "bg-warning";
    text = `Waiting on ${missingCount} ${missingCount === 1 ? "contract" : "contracts"}`;
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-borderDividers bg-cardLighterBG px-2.5 py-0.5 text-xs font-semibold text-primaryText">
      <span className={`size-2 rounded-full ${dot}`} />
      {text}
    </span>
  );
}

export default PayrollStatusChip;
