import type { Contract } from "../../../types/contracts";
import AdminContractsTableRow from "./AdminContractsTableRow";

type DesktopAdminContractsTableProps = {
  visibleContracts: Contract[];
  selectedMonth: string;
};

function DesktopAdminContractsTable({
  visibleContracts,
  selectedMonth,
}: DesktopAdminContractsTableProps) {
  return (
    <table className="hidden w-full table-fixed text-left text-sm md:table">
      <thead className="text-xs text-secondaryText">
        <tr className="border-b border-borderDividers">
          <th className="w-[45%] py-2 pr-4 font-medium">Student</th>
          <th className="py-2 pr-4 font-medium">Status</th>
          <th className="py-2 pr-4 font-medium">Uploaded</th>
          <th className="w-24 py-2 font-medium text-center">
            <span className="">View</span>
          </th>
          <th className="w-24 py-2 font-medium text-center">
            <span className="">Download</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {visibleContracts.map((contract) => (
          <AdminContractsTableRow
            key={contract.user_id}
            contract={contract}
            selectedMonth={selectedMonth}
          />
        ))}
      </tbody>
    </table>
  );
}

export default DesktopAdminContractsTable;
