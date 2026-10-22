import { useState } from "react";
import { startOfMonth } from "date-fns";
import AdminContractsTable from "./AdminContractsTable";
import ContractsStatsCards from "./ContractsStatsCards";
import PeriodBar from "./PeriodBar";

function AdminContractsPageContent() {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    startOfMonth(new Date()),
  );

  console.log(selectedMonth);

  return (
    <div className="mt-12 flex flex-col gap-4">
      <PeriodBar
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />
      <ContractsStatsCards />
      <AdminContractsTable />
    </div>
  );
}

export default AdminContractsPageContent;
