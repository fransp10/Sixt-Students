import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format, isSameMonth, startOfMonth } from "date-fns";
import PageHeading from "../../components/PageHeading";
import PeriodBar from "../../components/PeriodBar/PeriodBar";
import AdminEarningsTabs, {
  type EarningsTab,
} from "../../components/Admin/AdminEarnings/AdminEarningsTabs";
import PayrollPanel from "../../components/Admin/AdminEarnings/PayrollPanel";
import RacePanel from "../../components/Admin/AdminEarnings/RacePanel";
import { useGetRaceMonths } from "../../hooks/useGetRaceStats";

function AdminEarningsPage() {
  // the tab lives in the URL so a refresh or a shared link opens the same view
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: EarningsTab =
    searchParams.get("tab") === "race" ? "race" : "payroll";

  const [selectedMonth, setSelectedMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const { data: workedMonths } = useGetRaceMonths();
  const month = format(selectedMonth, "yyyy-MM");

  // months someone worked in, plus the current month before its first shift
  function isMonthSelectable(date: Date) {
    if (!workedMonths || isSameMonth(date, new Date())) return true;
    return workedMonths.includes(format(date, "yyyy-MM"));
  }

  function handleTabChange(newTab: EarningsTab) {
    setSearchParams(newTab === "race" ? { tab: "race" } : {}, {
      replace: true,
    });
  }

  return (
    <div className="text-primaryText ">
      <PageHeading
        heading="Earnings"
        subheading="What you owe your students, month by month"
      />
      <AdminEarningsTabs tab={tab} onChange={handleTabChange} />

      <div className="mt-6 flex flex-col gap-4">
        <PeriodBar
          label={tab === "race" ? "Showing race for" : "Showing payroll for"}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          isMonthSelectable={isMonthSelectable}
        />
        {tab === "payroll" ? (
          <PayrollPanel month={month} />
        ) : (
          <RacePanel month={month} />
        )}
      </div>
    </div>
  );
}

export default AdminEarningsPage;
