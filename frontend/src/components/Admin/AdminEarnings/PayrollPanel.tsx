import { format, parseISO } from "date-fns";
import { useGetPayroll } from "../../../hooks/useGetPayroll";
import { formatStat } from "../../../helpers/formatStat";
import PayrollStatusChip from "./PayrollStatusChip";
import PayrollActions from "./PayrollActions";
import PayrollBudgetBar from "./PayrollBudgetBar";
import MissingContractsNotice from "./MissingContractsNotice";
import DesktopPayrollTable from "./DesktopPayrollTable";
import MobilePayrollList from "./MobilePayrollList";
import type { PayrollStatus } from "../../../types/payroll";

const TOTAL_LABELS: Record<PayrollStatus, string> = {
  in_progress: "Earned so far",
  nothing_to_pay: "To pay",
  ready: "To pay",
  partly_paid: "Left to pay",
  paid: "Paid",
};

function PanelMessage({ children }: { children: string }) {
  return (
    <div className="rounded-xl border border-borderDividers bg-cardBG p-4">
      <p className="py-8 text-center text-sm text-secondaryText">{children}</p>
    </div>
  );
}

function PayrollPanel({ month }: { month: string }) {
  const { data: payroll, isLoading, isError, isPlaceholderData } =
    useGetPayroll(month);

  if (isLoading) return <PanelMessage>Loading payroll...</PanelMessage>;
  if (isError || !payroll) return <PanelMessage>Error loading payroll</PanelMessage>;

  const monthName = format(parseISO(payroll.month), "MMMM");
  const { rows, status } = payroll;

  if (rows.length === 0 && status !== "in_progress") {
    return <PanelMessage>{`No hours were worked in ${monthName}.`}</PanelMessage>;
  }

  // only students with a contract for the month can be paid, the rest are
  // listed so the admin sees who is missing one, but nothing is owed to them
  const payable = rows.filter((row) => row.has_contract);
  const missing = rows.filter((row) => !row.has_contract);

  const payableHours = payable.reduce((sum, row) => sum + row.hours, 0);
  const payableAmount = payable.reduce((sum, row) => sum + (row.amount ?? 0), 0);
  const unpaidAmount = payable
    .filter((row) => row.paid_at === null)
    .reduce((sum, row) => sum + (row.amount ?? 0), 0);
  const paidAmount = payable.reduce((sum, row) => sum + (row.paid_amount ?? 0), 0);
  const paidAt = payable.reduce<string | null>(
    (latest, row) =>
      row.paid_at && (!latest || row.paid_at > latest) ? row.paid_at : latest,
    null,
  );

  const headlineAmount =
    status === "paid"
      ? paidAmount
      : status === "partly_paid"
        ? unpaidAmount
        : payableAmount;
  // hours can still be edited after a month is paid
  const changedSincePaid =
    status === "paid" && Math.abs(paidAmount - payableAmount) >= 0.01;

  return (
    // keyed by month so reminder and payment buttons start fresh on every month
    <section
      key={payroll.month}
      className={`rounded-xl border border-borderDividers bg-cardBG text-primaryText transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
    >
      <div className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-medium text-secondaryText">
                {TOTAL_LABELS[status]}
              </h2>
              <PayrollStatusChip payroll={payroll} paidAt={paidAt} />
            </div>
            <p className="mt-1 text-4xl font-semibold tabular-nums">
              {formatStat(headlineAmount, "€")}
            </p>
            <p className="mt-1 text-sm text-secondaryText tabular-nums">
              {formatStat(payableHours, " hours")} · {payable.length}{" "}
              {payable.length === 1 ? "student" : "students"} with a contract
              {missing.length > 0 && ` · ${missing.length} without`}
            </p>
            {status === "in_progress" && (
              <p className="mt-1 text-sm text-secondaryText">
                You can mark {monthName} as paid once the month ends.
              </p>
            )}
            {status === "nothing_to_pay" && (
              <p className="mt-1 text-sm text-secondaryText">
                Nobody has a {monthName} contract, so there is nothing to pay.
              </p>
            )}
            {changedSincePaid && (
              <p className="mt-1 text-sm text-warning">
                Hours changed after you paid {formatStat(paidAmount, "€")}.
              </p>
            )}
          </div>
          <PayrollActions payroll={payroll} />
        </div>

        <PayrollBudgetBar payroll={payroll} earned={payableAmount} />
        <MissingContractsNotice payroll={payroll} missing={missing} />
      </div>

      {rows.length === 0 ? (
        <p className="border-t border-borderDividers py-8 text-center text-sm text-secondaryText">
          No hours worked yet this month.
        </p>
      ) : (
        <>
          <DesktopPayrollTable
            rows={rows}
            month={payroll.month}
            payableHours={payableHours}
            payableAmount={payableAmount}
          />
          <MobilePayrollList
            rows={rows}
            month={payroll.month}
            payableAmount={payableAmount}
          />
        </>
      )}
    </section>
  );
}

export default PayrollPanel;
