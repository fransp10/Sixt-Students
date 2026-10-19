import { useParams } from "react-router-dom";
import AdminChosenStudentPageStatsCard from "./AdminChosenStudentPageStatsCard";
import {
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../LoadingSpinner";
import { useGetStats } from "../../hooks/useGetStats";
function AdminChosenStudentPageStats() {
  const { userId } = useParams<{ userId: string }>();

  const { thisMonthData, prevMonthData } = useGetStats(userId!);

  if (
    thisMonthData.status === "loading" ||
    prevMonthData.status === "loading"
  ) {
    return (
      <div className="flex size-26 items-center justify-center py-2">
        <LoadingSpinner size={26} />
      </div>
    );
  }

  if (thisMonthData.status === "error" || prevMonthData.status === "error") {
    return (
      <div className="flex h-12 items-center justify-center text-danger">
        Error loading stats
      </div>
    );
  }

  const statsForThisMonth = thisMonthData.data;
  const statsForPrevMonth = prevMonthData.data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 py-2 ">
      <AdminChosenStudentPageStatsCard
        icon={CalendarIcon}
        statName={"Shifts worked"}
        statValue={statsForThisMonth.totalShifts}
        previousValue={statsForPrevMonth.totalShifts}
      />
      <AdminChosenStudentPageStatsCard
        icon={ClockIcon}
        statName={"Hours worked"}
        statValue={statsForThisMonth.totalHours}
        previousValue={statsForPrevMonth.totalHours}
        suffix={"h"}
      />
      <AdminChosenStudentPageStatsCard
        icon={CurrencyEuroIcon}
        statName={"Earnings"}
        statValue={statsForThisMonth.totalEarnings}
        previousValue={statsForPrevMonth.totalEarnings}
        prefix={"€"}
      />
      <AdminChosenStudentPageStatsCard
        icon={ClipboardDocumentCheckIcon}
        statName={"Acceptance rate"}
        statValue={statsForThisMonth.acceptance.rate}
        previousValue={statsForPrevMonth?.acceptance.rate}
        suffix={"%"}
      />
    </div>
  );
}

export default AdminChosenStudentPageStats;
