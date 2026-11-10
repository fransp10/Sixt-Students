import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { formatStat } from "../../../helpers/formatStat";
import PayrollContractCell from "./PayrollContractCell";
import type { PayrollRow } from "../../../types/payroll";

type DesktopPayrollTableProps = {
  rows: PayrollRow[];
  month: string;
  // totals only cover students with a contract, nothing is owed to the others
  payableHours: number;
  payableAmount: number;
  isMonthOver: boolean; // students can only be paid once the month has ended
};

function DesktopPayrollTable({
  rows,
  month,
  payableHours,
  payableAmount,
  isMonthOver,
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
          <th scope="col" className="py-3 pl-8  font-medium text-right pr-8">
            Contract
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.user_id} className="border-b border-borderDividers">
            <th className="py-3.5 pl-5 pr-4 text-left font-normal text-primaryText">
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
            <td
              className={`py-3.5 pr-4 text-right tabular-nums ${row.has_contract ? "font-semibold" : "text-secondaryText"}`}
            >
              {formatStat(row.amount, "€")}
            </td>
            <td className="py-3.5 pl-8 pr-5 ">
              <PayrollContractCell
                row={row}
                month={month}
                canPay={isMonthOver}
              />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className=" border-borderDividers border-t-4 text-sm ">
        <tr className="font-semibold">
          <th className="py-4 pl-5 pr-4 text-left text-primaryText">
            {uploadedCount < rows.length ? "Total with contract" : "Total"}
          </th>
          <td className="py-4 pr-4 text-right tabular-nums">
            {formatStat(payableHours, "h")}
          </td>
          <td />
          <td className="py-4 pr-4 text-right tabular-nums">
            {formatStat(payableAmount, "€")}
          </td>
          <td className="py-4 pl-8 pr-5 text-sm font-normal text-secondaryText text-right">
            {uploadedCount} of {rows.length} uploaded
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default DesktopPayrollTable;
