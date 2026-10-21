import {
  BanknotesIcon,
  CalendarIcon,
  ClockIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import StatsCard from "./StatsCard";
import NextShiftCard from "./NextShiftCard";
import { useGetMyStats } from "../../hooks/useGetMyStats";
import EmptyStatsCard from "./Dashboard/EmptyStatsCard";
import { formatStat } from "../../helpers/formatStat";

function StudentStatList({ chosenMonth }: { chosenMonth: Date }) {
  const stats = useGetMyStats();

  if (stats.isLoading) {
    return <div>Loading...</div>;
  }

  if (!stats.data) {
    return <div>No stats available</div>;
  }

  const areThereStatsForChosenMonth = stats.data.byMonth[
    chosenMonth.getFullYear()
  ]?.some((m) => m.monthNumber === chosenMonth.getMonth() + 1);

  const currentMonthStats = stats.data.byMonth[chosenMonth.getFullYear()]?.find(
    (m) => m.monthNumber === chosenMonth.getMonth() + 1,
  );

  const { averageMonth } = stats.data;
  return (
    <>
      <NextShiftCard />
      {areThereStatsForChosenMonth && (
        <>
          <StatsCard
            icon={BanknotesIcon}
            title="Earnings this month"
            value={currentMonthStats?.earnings ?? 0}
            format={(n) => formatStat(n, "€")}
            previous={averageMonth.earnings}
            comparisonLabel="average month"
          />
          <StatsCard
            icon={CalendarIcon}
            title="Shifts worked this month"
            value={currentMonthStats?.count ?? 0}
            previous={averageMonth.count}
            comparisonLabel="average month"
          />
          <StatsCard
            icon={ClockIcon}
            title="Total hours this month"
            value={currentMonthStats?.hours ?? 0}
            format={(n) => formatStat(n, "h")}
            previous={averageMonth.hours}
            comparisonLabel="average month"
          />
          <StatsCard
            icon={PlusCircleIcon}
            title="Attendance rate"
            value={currentMonthStats?.attendanceRate ?? 0}
            format={(n) => formatStat(n, "%")}
            previous={averageMonth.attendanceRate}
            comparisonLabel="average month"
          />
        </>
      )}

      {!areThereStatsForChosenMonth && (
        <>
          <EmptyStatsCard />
          <EmptyStatsCard />
          <EmptyStatsCard />
          <EmptyStatsCard />
        </>
      )}
    </>
  );
}

export default StudentStatList;
