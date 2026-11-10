import { differenceInCalendarDays, endOfMonth, format, parseISO } from "date-fns";
import type { Payroll } from "../../../types/payroll";

// one neutral pill for every status, only the dot carries colour
function PayrollStatusChip({
  payroll,
  paidAt,
}: {
  payroll: Payroll;
  paidAt: string | null; // latest payment date among the paid students
}) {
  const today = new Date();
  const daysLeft = differenceInCalendarDays(endOfMonth(today), today);

  let dot = "bg-primary";
  let text = "Ready to pay";

  if (payroll.status === "paid") {
    dot = "bg-success";
    text = paidAt ? `Paid on ${format(parseISO(paidAt), "d MMM")}` : "Paid";
  } else if (payroll.status === "partly_paid") {
    dot = "bg-warning";
    text = "Partly paid";
  } else if (payroll.status === "nothing_to_pay") {
    dot = "bg-secondaryText";
    text = "Nothing to pay";
  } else if (payroll.status === "in_progress") {
    dot = "bg-pending";
    text =
      daysLeft === 0
        ? "In progress · last day"
        : `In progress · ${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-borderDividers bg-cardLighterBG px-2.5 py-0.5 text-xs font-semibold text-primaryText">
      <span className={`size-2 rounded-full ${dot}`} />
      {text}
    </span>
  );
}

export default PayrollStatusChip;
