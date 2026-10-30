import { useMemo, useState } from "react";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import ContractsFilterTabs from "./ContractsFilterTabs";
import type { ContractFilter } from "../../../types/adminContract";
import DesktopAdminContractsTable from "./DesktopAdminContractsTable";
import MobileAdminContractsTable from "./MobileAdminContractsTable";
import { useGetAllContractsAdmin } from "../../../hooks/useGetAllContractsAdmin";
import ContractsStatsCards from "./ContractsStatsCards";
import { format } from "date-fns";

// placeholder rows until the contracts endpoint exists
// const contracts: AdminContractRow[] = [
//   {
//     student_id: 1,
//     first_name: "Ana",
//     last_name: "Horvat",
//     email: "ana.horvat@mail.com",
//     contract_id: 11,
//     uploaded_at: "2026-10-21T14:02:00",
//   },
//   {
//     student_id: 2,
//     first_name: "Luka",
//     last_name: "Babić",
//     email: "luka.babic@mail.com",
//     contract_id: null,
//     uploaded_at: null,
//   },
//   {
//     student_id: 3,
//     first_name: "Marko",
//     last_name: "Kovač",
//     email: "marko.kovac@mail.com",
//     contract_id: 12,
//     uploaded_at: "2026-10-19T09:30:00",
//   },
//   {
//     student_id: 4,
//     first_name: "Ivana",
//     last_name: "Novak",
//     email: null,
//     contract_id: 13,
//     uploaded_at: "2026-10-15T18:47:00",
//   },
//   {
//     student_id: 5,
//     first_name: "Petra",
//     last_name: "Jurić",
//     email: "petra.juric@mail.com",
//     contract_id: null,
//     uploaded_at: null,
//   },
//   {
//     student_id: 6,
//     first_name: "Tomislav",
//     last_name: "Marić",
//     email: "tomislav.maric@mail.com",
//     contract_id: 14,
//     uploaded_at: "2026-10-03T11:12:00",
//   },
// ];

function AdminContractsTable({ selectedMonth }: { selectedMonth?: string }) {
  const [filter, setFilter] = useState<ContractFilter>("all");

  const {
    data: contracts,
    isError,
    isLoading,
  } = useGetAllContractsAdmin(selectedMonth);
  console.log(contracts);

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
  console.log(visibleContracts);
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
          <button
            type="button"
            disabled={uploadedCount === 0}
            className="flex min-h-9 items-center justify-center gap-2 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-primaryText cursor-pointer hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArchiveBoxArrowDownIcon className="size-5" />
            Download all ({uploadedCount})
          </button>
        </div>

        {visibleContracts.length === 0 ? (
          <p className="py-8 text-center text-sm text-secondaryText">
            No students contracts here
          </p>
        ) : (
          <>
            <DesktopAdminContractsTable visibleContracts={visibleContracts} />
            <MobileAdminContractsTable visibleContracts={visibleContracts} />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminContractsTable;
