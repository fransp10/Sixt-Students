import type { AdminContractRow } from "../../../types/adminContract";
import AdminContractsMobileCard from "./AdminContractsMobileCard";

type MobileAdminContractsTable = {
  visibleContracts: AdminContractRow[];
};

function MobileAdminContractsTable({
  visibleContracts,
}: MobileAdminContractsTable) {
  return (
    <div className="flex flex-col gap-2 md:hidden">
      {visibleContracts.map((contract) => (
        <AdminContractsMobileCard
          key={contract.student_id}
          contract={contract}
        />
      ))}
    </div>
  );
}

export default MobileAdminContractsTable;
