import AdminChosenStudentPageStatsCard from "./AdminChosenStudentPageStatsCard";
import {
  CalendarIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";
function AdminChosenStudentPageStats() {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl">This month</span>
      <div className="grid grid-cols-5 gap-4">
        <AdminChosenStudentPageStatsCard
          icon={CalendarIcon}
          statName={"Shifts worked"}
          statValue={12}
          lastMonthValue={2}
        />
        <AdminChosenStudentPageStatsCard
          icon={ClockIcon}
          statName={"Hours worked"}
          statValue={"84 h"}
          lastMonthValue={2}
        />
        <AdminChosenStudentPageStatsCard
          icon={CurrencyEuroIcon}
          statName={"Earnings "}
          statValue={"€756"}
          lastMonthValue={"€122"}
        />
        <AdminChosenStudentPageStatsCard
          icon={ClipboardDocumentCheckIcon}
          statName={"Requests made"}
          statValue={18}
          lastMonthValue={2}
        />
        <AdminChosenStudentPageStatsCard
          icon={CheckBadgeIcon}
          statName={"Requests accepted"}
          statValue={18}
          lastMonthValue={2}
        />
      </div>
    </div>
  );
}

export default AdminChosenStudentPageStats;
