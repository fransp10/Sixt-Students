import {
  BanknotesIcon,
  InboxArrowDownIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import AdminStatCard from "./AdminStatCard";
import AdminTodayShifts from "./AdminTodayShifts";
import AdminPendingRequests from "./AdminPendingRequests";
import AdminHoursPayrollChart from "./AdminHoursPayrollChart";
import { formatStat } from "../../helpers/formatStat";
import { useAdminStats } from "../../hooks/useAdminStats";

function AdminDashboardContent() {
  const currentMonth = format(new Date(), "MMMM");
  const { data: adminStats, isLoading, isError } = useAdminStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading admin stats</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <AdminStatCard
          title="Active students"
          value={formatStat(adminStats.activeStudents)}
          caption="Students who can sign up for shifts"
          period={currentMonth}
          icon={UsersIcon}
        />
        <AdminStatCard
          title="Shift requests"
          value={formatStat(adminStats.shiftRequests)}
          caption="Requests waiting for your review"
          period={currentMonth}
          icon={InboxArrowDownIcon}
        />
        <AdminStatCard
          title="Payroll"
          value={formatStat(adminStats.totalPayroll, "€")}
          caption="Total student earnings"
          period={currentMonth}
          icon={BanknotesIcon}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Pending requests */}
        <AdminPendingRequests />
        <AdminTodayShifts />
        <AdminHoursPayrollChart />
        <div className="col-span-1 bg-cardBG h-120 p-4 rounded-lg">
          <h2 className="text-primaryText font-bold">Top Hours</h2>
        </div>
        <div className="col-span-full bg-cardBG h-120 p-4 rounded-lg">
          <h2 className="text-primaryText font-bold">
            Recently added students
          </h2>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardContent;
