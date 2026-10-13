import { H1Icon } from "@heroicons/react/24/outline";
import StatsCard from "../student/StatsCard";

function AdminDashboardContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <StatsCard
        title="Active students"
        value={24}
        lastMonthValue={+2}
        icon={H1Icon}
      />
      <StatsCard
        title="Pending shift requests"
        value={24}
        lastMonthValue={+2}
        icon={H1Icon}
      />
      <StatsCard
        title="Understaffed shifts"
        value={"3 of 21 shifts"}
        lastMonthValue={+2}
        icon={H1Icon}
      />
      <StatsCard
        title="Payroll"
        value={"2,703$"}
        lastMonthValue={+8}
        icon={H1Icon}
      />
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
  );
}

export default AdminDashboardContent;
