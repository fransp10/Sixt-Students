import { useState } from "react";
import { format, isSameMonth, min, parseISO, startOfMonth } from "date-fns";
import PageHeading from "../../components/PageHeading";
import PeriodBar from "../../components/PeriodBar/PeriodBar";
import StudentContractCard from "../../components/student/Contracts/StudentContractCard";
import UploadWindowList from "../../components/student/Contracts/UploadWindowList";
import UploadContractModal from "../../components/student/UploadContractModal";
import {
  getContractUploadWindow,
  isContractMonthUploadable,
} from "../../helpers/contractUploadWindow";
import { useGetContracts } from "../../hooks/useGetContracts";

function StudentContractsPage() {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: contracts } = useGetContracts();

  if (contracts === undefined || !contracts) {
    return <div>Loading...</div>;
  }

  const { firstMonth, lastMonth } = getContractUploadWindow();

  function findContract(month: Date) {
    return (
      contracts &&
      contracts.find((contract) =>
        isSameMonth(parseISO(contract.contract_month), month),
      )
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
            {contracts && (
              <StudentContractCard
                key={format(selectedMonth, "yyyy-MM")}
                month={selectedMonth}
                contract={findContract(selectedMonth)}
                isUploadable={isContractMonthUploadable(selectedMonth)}
                onUpload={() => setIsUploadModalOpen(true)}
              />
            )}
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
