import AdminChosenStudentPageStatsCard from "./AdminChosenStudentPageStatsCard";
import {
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";
function AdminChosenStudentPageStats() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0 sm:gap-4
     py-4 "
    >
      <AdminChosenStudentPageStatsCard
        icon={CalendarIcon}
        statName={"Shifts worked"}
        statValue={12}
        previousValue={2}
      />
      <AdminChosenStudentPageStatsCard
        icon={ClockIcon}
        statName={"Hours worked"}
        statValue={"84"}
        previousValue={2}
      />
      <AdminChosenStudentPageStatsCard
        icon={CurrencyEuroIcon}
        statName={"Earnings"}
        statValue={"756"}
        previousValue={"122"}
      />
      <AdminChosenStudentPageStatsCard
        icon={ClipboardDocumentCheckIcon}
        statName={"Acceptance rate"}
        statValue={78}
        previousValue={2}
      />
    </div>
  );
}

export default AdminChosenStudentPageStats;
