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
    <div className=" flex flex-col gap-4 overflow-x-hidden">
      <RacePageHeading
        chosenMonth={chosenMonth}
        handleMonthChange={setChosenMonth}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* the odometer drums only fit a third of the width on 2xl screens,
            below that it gets its own row under the goal and gear */}
        <div className="grid grid-cols-1 gap-4 md:col-span-3 md:grid-cols-2 2xl:grid-cols-3">
          <RaceEarningsMonthlyGoal
            chosenMonth={chosenMonth}
            earned={currentMonthEarnings ?? 0}
          />
          <Odometer
            earnings={myStats?.totalEarnings ?? 0}
            hoursWorked={myStats?.totalHours ?? 0}
            shifts={myStats?.totalShifts ?? 0}
            hourlyRate={me?.default_hourly_rate ?? 0}
          />
          <Gear hoursWorked={myStats?.totalHours ?? 0} />
        </div>
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
