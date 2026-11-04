import { useState } from "react";
import AdminContractsTable from "./AdminContractsTable";
import PeriodBar from "../../PeriodBar/PeriodBar";
import { format, startOfMonth } from "date-fns";

function AdminContractsPageContent() {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    startOfMonth(new Date()),
  );

  return (
    <div className="mt-12 flex flex-col gap-4">
      <PeriodBar
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />
      <AdminContractsTable selectedMonth={format(selectedMonth, "yyyy-MM")} />
    </div>
  );
}

export default AdminContractsPageContent;
