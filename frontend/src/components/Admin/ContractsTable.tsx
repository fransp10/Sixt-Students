import type { Student } from "../../types/students";
import ContractTableRow from "./ContractTableRow";

function ContractsTable({
  tableRowMonths,
  student,
}: {
  tableRowMonths: string[];
  student: Student | undefined;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-borderDividers">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-cardLighterBG h-12 border-b border-borderDividers text-left">
            <th className="w-[18%] px-4 text-xs font-medium text-secondaryText">
              Month
            </th>
            <th className="w-[18%] px-4 text-xs font-medium text-secondaryText">
              Status
            </th>

            <th className="w-[28%] px-4 text-xs font-medium text-secondaryText">
              File
            </th>
            <th className="w-[18%] px-4 text-xs font-medium text-secondaryText">
              Uploaded
            </th>
            <th className="w-[18%] px-4 text-xs font-medium text-secondaryText">
              Actions
            </th>
          </tr>
        </thead>

        {}
        <tbody>
          {tableRowMonths.map((month) => (
            <ContractTableRow
              status="pending"
              student={student}
              key={month}
              month={month}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContractsTable;
