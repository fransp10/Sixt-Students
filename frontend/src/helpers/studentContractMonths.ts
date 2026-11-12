import { format, isAfter, isBefore, startOfMonth } from "date-fns";
import type { ContractsWithoutSignedUrl } from "../types/contracts";
import { getContractUploadWindow } from "./contractUploadWindow";

// uploaded: file is there
// missing: the month has started, nothing uploaded, the student can still upload
// closed: same, but the upload window is over
// upcoming: the month hasn't started yet
export type ContractMonthStatus =
  "uploaded" | "missing" | "closed" | "upcoming";

export type ContractMonth = {
  month: Date;
  status: ContractMonthStatus;
  contract?: ContractsWithoutSignedUrl;
};

// the months of one year the student has had a contract to hand in, newest first.
// months before the student started are left out, so a new student has no "missing" backlog
export function getContractMonths(
  year: number,
  contracts: ContractsWithoutSignedUrl[],
  startedAt: Date | string | undefined,
): ContractMonth[] {
  const byMonth = new Map(contracts.map((c) => [c.contract_month, c]));
  const currentMonth = startOfMonth(new Date());
  const { firstMonth } = getContractUploadWindow();
  const startMonth = startOfMonth(
    startedAt ? new Date(startedAt) : new Date(0),
  );

  const months: ContractMonth[] = [];

  for (let m = 11; m >= 0; m--) {
    const month = new Date(year, m, 1);
    const contract = byMonth.get(format(month, "yyyy-MM"));

    if (isBefore(month, startMonth) && !contract) continue;

    let status: ContractMonthStatus;
    if (contract) status = "uploaded";
    else if (isAfter(month, currentMonth)) status = "upcoming";
    else if (isBefore(month, firstMonth)) status = "closed";
    else status = "missing";

    months.push({ month, status, contract });
  }

  return months;
}
