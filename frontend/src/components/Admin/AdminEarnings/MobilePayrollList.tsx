import { Link } from "react-router-dom";
import { formatStat } from "../../../helpers/formatStat";
import PayrollContractCell from "./PayrollContractCell";
import type { PayrollRow } from "../../../types/payroll";

type MobilePayrollListProps = {
  rows: PayrollRow[];
  month: string;
  payableAmount: number; // only students with a contract, nothing is owed to the others
};

// amount on the right, the contract only shows up when it's missing
function MobilePayrollList({ rows, month, payableAmount }: MobilePayrollListProps) {
  const missingCount = rows.filter((row) => !row.has_contract).length;

  return (
    <ul className="border-t border-borderDividers md:hidden">
      {rows.map((row) => (
        <li
          key={row.user_id}
          className="flex items-start justify-between gap-4 border-b border-borderDividers px-5 py-3.5"
        >
          <div className="min-w-0">
            <Link
              to={`/admin/students/${row.user_id}`}
              className="font-semibold hover:text-primary"
            >
              {row.first_name} {row.last_name}
            </Link>
            <p className="text-sm text-secondaryText tabular-nums">
              {row.amount === null
                ? formatStat(row.hours, "h")
                : `${formatStat(row.hours, "h")} × ${formatStat(row.amount / row.hours, "€")}/h`}
            </p>
            {!row.has_contract && (
              <div className="mt-2">
                <PayrollContractCell row={row} month={month} />
              </div>
            )}
          </div>
          <p className="font-semibold tabular-nums">
            {row.amount === null ? (
              <span className="font-normal text-secondaryText">—</span>
            ) : (
              formatStat(row.amount, "€")
            )}
          </p>
        </li>
      ))}
      <li className="flex justify-between px-5 py-4 font-semibold">
        <span>{missingCount > 0 ? "Total with contract" : "Total"}</span>
        <span className="tabular-nums">{formatStat(payableAmount, "€")}</span>
      </li>
    </ul>
  );
}

export default MobilePayrollList;
