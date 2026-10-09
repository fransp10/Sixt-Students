import { format } from "date-fns";
import RaceEarningsMonthlyGoal from "../components/student/RacePage/RaceEarningsMonthlyGoal";
import Odometer from "../components/student/RacePage/Odometer";
import Gear from "../components/student/RacePage/Gear";
import Race from "../components/student/RacePage/Race";
import Podium from "../components/student/RacePage/Podium";
import Overtake from "../components/student/RacePage/Overtake";
import Turbo from "../components/student/RacePage/Turbo";
import { useGetMyStats } from "../hooks/useGetMyStats";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import { useGetRaceStats } from "../hooks/useGetRaceStats";
import { useState } from "react";
import RacePageHeading from "../components/student/RacePage/RacePageHeading";

function EarningsPage() {
  // "yyyy-MM", the same format the select options and the API use
  const [chosenMonth, setChosenMonth] = useState(format(new Date(), "yyyy-MM"));
  const { data: myStats, isLoading, isError } = useGetMyStats();
  const { currentUser: me } = useAuthContext();
  const {
    data: raceStats,
    isLoading: isLoadingRaceStats,
    isError: isErrorRaceStats,
  } = useGetRaceStats(chosenMonth);

  const [chosenYear, chosenMonthNumber] = chosenMonth.split("-").map(Number);

  if (isLoading || isLoadingRaceStats) {
    return <div>Loading...</div>;
  }
  if (isError || isErrorRaceStats || !myStats || !raceStats) {
    return <div>Error loading stats.</div>;
  }

  const currentMonthEarnings = myStats?.byMonth[chosenYear]?.find(
    (monthData) => monthData.monthNumber === chosenMonthNumber,
  )?.earnings;

  const top3 = raceStats.slice(0, 3);

  return (
    <div className=" flex flex-col gap-4">
      <RacePageHeading
        chosenMonth={chosenMonth}
        handleMonthChange={setChosenMonth}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <RaceEarningsMonthlyGoal
          earned={currentMonthEarnings ?? 0}
          goal={600}
        />
        <Odometer
          earnings={myStats?.totalEarnings ?? 0}
          hoursWorked={myStats?.totalHours ?? 0}
          shifts={myStats?.totalShifts ?? 0}
          hourlyRate={me?.default_hourly_rate ?? 0}
        />
        <Gear hoursWorked={myStats?.totalHours ?? 0} />
        <Race raceStats={raceStats} />
        <Podium top3={top3} currentMonth={chosenMonth} />
        <Turbo
          stats={myStats}
          chosenYear={chosenYear}
          chosenMonthNumber={chosenMonthNumber}
        />

        <Overtake raceStats={raceStats} />
      </div>
    </div>
  );
}

export default EarningsPage;
