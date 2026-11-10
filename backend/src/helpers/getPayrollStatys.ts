import { format } from "date-fns";
import { PayrollRow, PayrollStatus } from "../types/payroll.js";

export function getPayrollStatus(
  month: string, // YYYY-MM
  rows: PayrollRow[],
): PayrollStatus {
  if (month >= format(new Date(), "yyyy-MM")) return "in_progress";

  // students without a contract for the month are not owed anything,
  // so only the ones with a contract decide the status
  const payableRows = rows.filter((row) => row.has_contract);
  if (payableRows.length === 0) return "nothing_to_pay";

  const paidCount = payableRows.filter((row) => row.paid_at !== null).length;

  if (paidCount === payableRows.length) return "paid";
  if (paidCount > 0) return "partly_paid";
  return "ready";
}
