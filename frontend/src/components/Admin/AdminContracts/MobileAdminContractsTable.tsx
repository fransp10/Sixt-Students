import type { Contract } from "../../../types/contracts";
import AdminContractsMobileCard from "./AdminContractsMobileCard";

type MobileAdminContractsTable = {
  visibleContracts: Contract[];
};

function MobileAdminContractsTable({
  visibleContracts,
}: MobileAdminContractsTable) {
  return (
    <div className="flex flex-col gap-2 md:hidden">
      {visibleContracts.map((contract) => (
        <AdminContractsMobileCard key={contract.user_id} contract={contract} />
      ))}
    </div>
  );
}

export default MobileAdminContractsTable;
