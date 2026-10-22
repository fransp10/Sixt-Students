import type { AdminContractRow } from "../../../types/adminContract";
import AdminContractsTableRow from "./AdminContractsTableRow";

type DesktopAdminContractsTableProps = {
  visibleContracts: AdminContractRow[];
};

function DesktopAdminContractsTable({
  visibleContracts,
}: DesktopAdminContractsTableProps) {
  return (
    <table className="hidden w-full table-fixed text-left text-sm md:table">
      <thead className="text-xs text-secondaryText">
        <tr className="border-b border-borderDividers">
          <th className="w-[45%] py-2 pr-4 font-medium">Student</th>
          <th className="py-2 pr-4 font-medium">Status</th>
          <th className="py-2 pr-4 font-medium">Uploaded</th>
          <th className="w-16 py-2 font-medium">
            <span className="sr-only">Download</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {visibleContracts.map((contract) => (
          <AdminContractsTableRow
            key={contract.student_id}
            contract={contract}
          />
        ))}
      </tbody>
    </table>
  );
}

export default DesktopAdminContractsTable;
