import Race from "../../student/RacePage/Race";
import Podium from "../../student/RacePage/Podium";
import { useGetRaceStats } from "../../../hooks/useGetRaceStats";

// matches the payroll card so both tabs share one surface
const PANEL_SURFACE = "rounded-xl border border-borderDividers bg-cardBG";

// same race and podium the students see, for the month picked in the PeriodBar
function RacePanel({ month }: { month: string }) {
  const { data: raceStats, isLoading, isError } = useGetRaceStats(month);

  if (isLoading || isError || !raceStats) {
    return (
      <div className={`${PANEL_SURFACE} p-4`}>
        <p className="py-8 text-center text-sm text-secondaryText">
          {isLoading ? "Loading race..." : "Error loading race"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Race raceStats={raceStats} surface={PANEL_SURFACE} />
      <Podium
        top3={raceStats.slice(0, 3)}
        currentMonth={month}
        surface={PANEL_SURFACE}
      />
    </div>
  );
}

export default RacePanel;
