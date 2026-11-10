import { format } from "date-fns";
import { PayrollRow, PayrollStatus } from "../types/payroll.js";

export function getPayrollStatus(
  month: string, // YYYY-MM
  rows: PayrollRow[],
): PayrollStatus {
  if (month >= format(new Date(), "yyyy-MM")) return "in_progress";
  if (rows.length === 0) return "ready";

  const paidCount = rows.filter((row) => row.paid_at !== null).length;

  if (paidCount === rows.length) return "paid";
  if (paidCount > 0) return "partly_paid";

  const hasMissingContract = rows.some((row) => !row.has_contract);
  if (hasMissingContract) return "waiting_on_contracts";
  return "ready";
}
