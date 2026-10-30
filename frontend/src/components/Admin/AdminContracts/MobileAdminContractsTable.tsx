import type { Contract } from "../../../types/contracts";
import AdminContractsMobileCard from "./AdminContractsMobileCard";

type MobileAdminContractsTable = {
  visibleContracts: Contract[];
  selectedMonth: string;
};

function MobileAdminContractsTable({
  visibleContracts,
  selectedMonth,
}: MobileAdminContractsTable) {
  return (
    <div className="flex flex-col gap-2 md:hidden">
      {visibleContracts.map((contract) => (
        <AdminContractsMobileCard
          key={contract.user_id}
          contract={contract}
          selectedMonth={selectedMonth}
        />
      ))}
    </div>
  );
}

export default MobileAdminContractsTable;
