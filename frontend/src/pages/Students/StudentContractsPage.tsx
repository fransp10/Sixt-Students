import { useState } from "react";
import { isSameMonth, min, parseISO, startOfMonth } from "date-fns";
import PageHeading from "../../components/PageHeading";
import PeriodBar from "../../components/PeriodBar/PeriodBar";
import StudentContractCard from "../../components/student/Contracts/StudentContractCard";
import UploadWindowList from "../../components/student/Contracts/UploadWindowList";
import UploadContractModal from "../../components/student/UploadContractModal";
import {
  getContractUploadWindow,
  isContractMonthUploadable,
} from "../../helpers/contractUploadWindow";
import type { StudentContract } from "../../types/studentContract";

// placeholder data until the contracts endpoint exists
const contracts: StudentContract[] = [
  {
    id: 5,
    contract_month: "2026-03",
    file_name: "contract-march-2026.pdf",
    file_size: 1_020_000,
    uploaded_at: "2026-03-05T12:20:00",
  },
  {
    id: 1,
    contract_month: "2026-11",
    file_name: "contract-november-2026.pdf",
    file_size: 1_240_000,
    uploaded_at: "2026-10-20T10:15:00",
  },
  {
    id: 2,
    contract_month: "2026-10",
    file_name: "contract-october-2026.pdf",
    file_size: 980_000,
    uploaded_at: "2026-10-02T14:02:00",
  },
  {
    id: 3,
    contract_month: "2026-09",
    file_name: "contract-september-2026.pdf",
    file_size: 1_050_000,
    uploaded_at: "2026-09-01T09:30:00",
  },
  {
    id: 4,
    contract_month: "2026-08",
    file_name: "contract-august-2026.pdf",
    file_size: 1_110_000,
    uploaded_at: "2026-08-04T18:47:00",
  },
];

function StudentContractsPage() {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { firstMonth, lastMonth } = getContractUploadWindow();

  function findContract(month: Date) {
    return contracts.find((contract) =>
      isSameMonth(parseISO(contract.contract_month), month),
    );
  }

  // a month can be opened if it's still uploadable, or if a contract was uploaded for it
  function isMonthSelectable(month: Date) {
    return isContractMonthUploadable(month) || !!findContract(month);
  }

  const earliestMonth = min([
    firstMonth,
    ...contracts.map((contract) => parseISO(contract.contract_month)),
  ]);
  const selectedContract = findContract(selectedMonth);

  return (
    <div>
      <PageHeading
        heading="Contracts"
        subheading="Upload and manage your monthly work contracts."
      />

      <div className="mt-8 flex flex-col gap-4">
        <PeriodBar
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          minMonth={earliestMonth}
          maxMonth={lastMonth}
          isMonthSelectable={isMonthSelectable}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StudentContractCard
              month={selectedMonth}
              contract={selectedContract}
              isUploadable={isContractMonthUploadable(selectedMonth)}
              onUpload={() => setIsUploadModalOpen(true)}
            />
          </div>
          <UploadWindowList
            contracts={contracts}
            selectedMonth={selectedMonth}
            onSelect={setSelectedMonth}
          />
        </div>
      </div>

      {isUploadModalOpen && (
        <UploadContractModal
          month={selectedMonth}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
}

export default StudentContractsPage;
