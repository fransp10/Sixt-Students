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
  waiting_on_contracts: "To pay",
  ready: "To pay",
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
  const { rows, status, payment } = payroll;

  if (rows.length === 0 && status !== "in_progress") {
    return <PanelMessage>{`No hours were worked in ${monthName}.`}</PanelMessage>;
  }

  const totalHours = rows.reduce((sum, row) => sum + row.hours, 0);
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
  const missing = rows.filter((row) => !row.has_contract);
  // hours can still be edited after a month is paid
  const changedSincePaid =
    payment && Math.abs(payment.paid_amount - totalAmount) >= 0.01;

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
              <PayrollStatusChip payroll={payroll} missingCount={missing.length} />
            </div>
            <p className="mt-1 text-4xl font-semibold tabular-nums">
              {formatStat(totalAmount, "€")}
            </p>
            <p className="mt-1 text-sm text-secondaryText tabular-nums">
              {formatStat(totalHours, " hours")} · {rows.length}{" "}
              {rows.length === 1 ? "student" : "students"}
            </p>
            {status === "in_progress" && (
              <p className="mt-1 text-sm text-secondaryText">
                You can mark {monthName} as paid once the month ends.
              </p>
            )}
            {changedSincePaid && (
              <p className="mt-1 text-sm text-warning">
                Hours changed after you paid{" "}
                {formatStat(payment.paid_amount, "€")}.
              </p>
            )}
          </div>
          <PayrollActions payroll={payroll} />
        </div>

        <PayrollBudgetBar payroll={payroll} earned={totalAmount} />
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
            totalHours={totalHours}
            totalAmount={totalAmount}
          />
          <MobilePayrollList
            rows={rows}
            month={payroll.month}
            totalAmount={totalAmount}
          />
        </>
      )}
    </section>
  );
}

export default PayrollPanel;
