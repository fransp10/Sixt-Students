import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { formatStat } from "../../../helpers/formatStat";
import PayrollContractCell from "./PayrollContractCell";
import type { PayrollRow } from "../../../types/payroll";

type DesktopPayrollTableProps = {
  rows: PayrollRow[];
  month: string;
  totalHours: number;
  totalAmount: number;
};

function DesktopPayrollTable({
  rows,
  month,
  totalHours,
  totalAmount,
}: DesktopPayrollTableProps) {
  const uploadedCount = rows.filter((row) => row.has_contract).length;

  return (
    <table className="hidden w-full text-left md:table">
      <caption className="sr-only">
        {format(parseISO(month), "MMMM yyyy")} payout by student
      </caption>
      <thead>
        <tr className="border-y border-borderDividers text-sm text-secondaryText">
          <th scope="col" className="py-3 pl-5 pr-4 font-medium">
            Student
          </th>
          <th scope="col" className="py-3 pr-4 text-right font-medium">
            Hours
          </th>
          <th scope="col" className="py-3 pr-4 text-right font-medium">
            Rate
          </th>
          <th scope="col" className="py-3 pr-4 text-right font-medium">
            Amount
          </th>
          <th scope="col" className="py-3 pl-8 pr-5 font-medium">
            Contract
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.user_id} className="border-b border-borderDividers">
            <th className="py-3.5 pl-5 pr-4 text-left font-semibold">
              <Link
                to={`/admin/students/${row.user_id}`}
                className="hover:text-primary"
              >
                {row.first_name} {row.last_name}
              </Link>
            </th>
            <td className="py-3.5 pr-4 text-right tabular-nums">
              {formatStat(row.hours, "h")}
            </td>
            <td className="py-3.5 pr-4 text-right tabular-nums text-secondaryText">
              {formatStat(row.amount / row.hours, "€")}/h
            </td>
            <td className="py-3.5 pr-4 text-right font-semibold tabular-nums">
              {formatStat(row.amount, "€")}
            </td>
            <td className="py-3.5 pl-8 pr-5">
              <PayrollContractCell row={row} month={month} />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="font-semibold">
          <th className="py-4 pl-5 pr-4 text-left">Total</th>
          <td className="py-4 pr-4 text-right tabular-nums">
            {formatStat(totalHours, "h")}
          </td>
          <td />
          <td className="py-4 pr-4 text-right tabular-nums">
            {formatStat(totalAmount, "€")}
          </td>
          <td className="py-4 pl-8 pr-5 text-sm font-normal text-secondaryText">
            {uploadedCount} of {rows.length} uploaded
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default DesktopPayrollTable;
