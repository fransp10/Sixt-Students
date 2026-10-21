import {
  BanknotesIcon,
  InboxArrowDownIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import AdminStatCard from "./AdminStatCard";
import { formatStat } from "../../helpers/formatStat";

function AdminDashboardContent() {
  const currentMonth = format(new Date(), "MMMM");

  // TODO: replace placeholder numbers with data from the admin stats endpoint
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <AdminStatCard
          title="Active students"
          value={formatStat(24)}
          caption="Students with at least one shift"
          period={currentMonth}
          icon={UsersIcon}
        />
        <AdminStatCard
          title="Shift requests"
          value={formatStat(24)}
          caption="Requests waiting for your review"
          period={currentMonth}
          icon={InboxArrowDownIcon}
        />
        <AdminStatCard
          title="Payroll"
          value={formatStat(2703, "€")}
          caption="Total student earnings"
          period={currentMonth}
          icon={BanknotesIcon}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Pending requests */}
        <div className="p-4 bg-cardBG col-span-2 h-120 rounded-lg">
          <h2 className="text-primaryText font-bold">Pending requests</h2>
        </div>
        {/* Today shifts */}
        <div className="p-4 bg-cardBG col-span-2 h-120 rounded-lg">
          <h2 className="text-primaryText font-bold">Today</h2>
        </div>
        <div className="col-span-3 bg-cardBG h-120 p-4 rounded-lg">
          <h2 className="text-primaryText font-bold">Hours & payroll</h2>
        </div>
        <div className="col-span-1 bg-cardBG h-120 p-4 rounded-lg">
          <h2 className="text-primaryText font-bold">Top Hours</h2>
        </div>
        <div className="col-span-full bg-cardBG h-120 p-4 rounded-lg">
          <h2 className="text-primaryText font-bold">Recently added students</h2>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardContent;
