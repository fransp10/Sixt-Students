import {
  BanknotesIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import StatsCard from "./StatsCard";
import NextShiftCard from "./NextShiftCard";
import { useGetMyStats } from "../../hooks/useGetMyStats";
import EmptyStatsCard from "./Dashboard/EmptyStatsCard";
import { formatStat } from "../../helpers/formatStat";
import { format } from "date-fns";

function StudentStatList({ chosenMonth }: { chosenMonth: Date }) {
  const stats = useGetMyStats();

  if (stats.isLoading) {
    return <div>Loading...</div>;
  }

  if (!stats.data) {
    return <div>No stats available</div>;
  }

  const currentMonthStats = stats.data.byMonth.find(
    (m) => m.month === format(chosenMonth, "yyyy-MM"),
  );
  const areThereStatsForChosenMonth = currentMonthStats !== undefined;

  const { averageMonth } = stats.data;
  return (
    <>
      <NextShiftCard />
      {areThereStatsForChosenMonth && (
        <>
          <StatsCard
            icon={BanknotesIcon}
            title="Earnings"
            value={currentMonthStats?.earnings ?? 0}
            format={(n) => formatStat(n, "€")}
            previous={averageMonth.earnings}
            comparisonLabel="average month"
          />
          <StatsCard
            icon={CalendarIcon}
            title="Shifts"
            value={currentMonthStats?.count ?? 0}
            previous={averageMonth.count}
            comparisonLabel="average month"
          />
          <StatsCard
            icon={ClockIcon}
            title="Hours"
            value={currentMonthStats?.hours ?? 0}
            format={(n) => formatStat(n, "h")}
            previous={averageMonth.hours}
            comparisonLabel="average month"
          />
          <StatsCard
            icon={CheckCircleIcon}
            title="Attendance"
            value={currentMonthStats?.attendanceRate ?? 0}
            format={(n) => formatStat(n, "%")}
            previous={averageMonth.attendanceRate}
            comparisonLabel="average month"
          />
        </>
      )}

      {!areThereStatsForChosenMonth && <EmptyStatsCard />}
    </>
  );
}

export default StudentStatList;
