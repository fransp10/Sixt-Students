import { useEffect, useMemo, useState } from "react";
import ContractsFilterTabs from "./ContractsFilterTabs";
import type { ContractFilter } from "../../../types/adminContract";
import DesktopAdminContractsTable from "./DesktopAdminContractsTable";
import MobileAdminContractsTable from "./MobileAdminContractsTable";
import { useGetAllContractsAdmin } from "../../../hooks/useGetAllContractsAdmin";
import ContractsStatsCards from "./ContractsStatsCards";
import { useSendContractReminders } from "../../../hooks/useSendContractReminders";
import { format } from "date-fns";
import ActionButtonsForTable from "./ActionButtonsForTable";

function AdminContractsTable({ selectedMonth }: { selectedMonth: string }) {
  const [filter, setFilter] = useState<ContractFilter>("all");
  const {
    mutate: remindMissing,
    isPending: isPendingReminders,
    isSuccess: isRemindersSent,
    reset: resetReminders,
  } = useSendContractReminders();

  // a new month has its own missing students, so the bulk button starts fresh
  useEffect(() => {
    resetReminders();
  }, [selectedMonth, resetReminders]);

  const {
    data: contracts,
    isError,
    isLoading,
  } = useGetAllContractsAdmin(selectedMonth);

  const lastUploadedAt = useMemo(
    () => contracts?.find((contract) => !!contract.uploaded_at)?.uploaded_at,
    [contracts],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-borderDividers bg-cardBG p-4">
        <p className="py-8 text-center text-sm text-secondaryText">
          Loading contracts...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-borderDividers bg-cardBG p-4">
        <p className="py-8 text-center text-sm text-secondaryText">
          Error loading contracts
        </p>
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-borderDividers bg-cardBG p-4">
        <p className="py-8 text-center text-sm text-secondaryText">
          No students contracts here
        </p>
      </div>
    );
  }

  const numOfContractsMissing = contracts.filter(
    (contract) => !contract.uploaded_at,
  ).length;
  const uploadedCount = contracts.filter(
    (contract) => !!contract.uploaded_at,
  ).length;
  const counts: Record<ContractFilter, number> = {
    all: contracts.length,
    missing: numOfContractsMissing,
    uploaded: contracts.length - numOfContractsMissing,
  };

  const lastUpload = lastUploadedAt
    ? format(lastUploadedAt, "MMM dd, yyyy")
    : "N/A";

  // missing contracts first
  const visibleContracts = contracts
    .filter((contract) => {
      if (filter === "all") return true;
      if (filter === "missing") return !contract.uploaded_at;
      if (filter === "uploaded") return !!contract.uploaded_at;
    })
    .sort((a, b) => Number(!!a.uploaded_at) - Number(!!b.uploaded_at));
  return (
    <div className="flex flex-col gap-4">
      <ContractsStatsCards
        missing={numOfContractsMissing}
        // total students is the same as total contracts since each student has one contract
        totalStudents={contracts.length}
        uploaded={uploadedCount}
        lastUpload={lastUpload}
      />
      <div className="flex flex-col gap-4 rounded-xl border border-borderDividers bg-cardBG p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <ContractsFilterTabs
            filter={filter}
            onChange={setFilter}
            counts={counts}
          />
          <ActionButtonsForTable
            numOfContractsMissing={numOfContractsMissing}
            isPendingReminders={isPendingReminders}
            isRemindersSent={isRemindersSent}
            remindMissing={remindMissing}
            selectedMonth={selectedMonth}
            uploadedCount={uploadedCount}
          />
        </div>

        {visibleContracts.length === 0 ? (
          <p className="py-8 text-center text-sm text-secondaryText">
            No students contracts here
          </p>
        ) : (
          <>
            <DesktopAdminContractsTable
              visibleContracts={visibleContracts}
              selectedMonth={selectedMonth}
            />
            <MobileAdminContractsTable
              visibleContracts={visibleContracts}
              selectedMonth={selectedMonth}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminContractsTable;
