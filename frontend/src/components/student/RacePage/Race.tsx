import { useState } from "react";
import RaceHeader from "./Race/RaceHeader";
import RaceModePicker from "./Race/RaceModePicker";
import RacingLine from "./Race/RacingLine";
import type { RaceStats, RaceStatsStudent } from "../../../types/raceStats";
import { RACE_MAX_STUDENTS_TO_DISPLAY } from "../../../helpers/constants";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";

function Race({
  raceStats,
  surface = "bg-cardLighterBG rounded-lg",
}: {
  raceStats: RaceStats;
  surface?: string;
}) {
  const [mode, setMode] = useState<"hours" | "shifts">("hours");

  const { currentUser } = useAuthContext();

  const sorted =
    mode === "hours"
      ? raceStats.toSorted((a, b) => b.hours_worked - a.hours_worked)
      : raceStats.toSorted((a, b) => b.shifts_worked - a.shifts_worked);

  const topRacers = sorted.slice(0, RACE_MAX_STUDENTS_TO_DISPLAY);
  const myIndex = sorted.findIndex((s) => Number(s.id) === currentUser?.id);
  const me = myIndex === -1 ? undefined : sorted[myIndex];
  const isMeOutsideTop = myIndex >= RACE_MAX_STUDENTS_TO_DISPLAY;

  const maxHoursValue = Math.max(
    ...raceStats.map((student: RaceStatsStudent) => student.hours_worked),
  );
  const maxShiftsValue = Math.max(
    ...raceStats.map((student: RaceStatsStudent) => student.shifts_worked),
  );

  return (
    <div
      className={`md:col-span-2 md:row-span-2 flex flex-col p-6 text-primaryText ${surface}`}
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <RaceHeader />
        <RaceModePicker handleChangeMode={setMode} mode={mode} />
      </div>
      <div>
        <ul className="flex flex-col gap-4 mt-6">
          {mode === "hours" &&
            topRacers.map((data, index) => (
              <RacingLine
                dataValue={data.hours_worked}
                position={index + 1}
                racer={data.first_name + " " + data.last_name}
                racerId={+data.id}
                maxValue={maxHoursValue}
                key={data.id}
                sufix="h"
              />
            ))}
          {mode === "shifts" &&
            topRacers.map((data, index) => (
              <RacingLine
                dataValue={data.shifts_worked}
                racerId={+data.id}
                position={index + 1}
                racer={data.first_name + " " + data.last_name}
                maxValue={maxShiftsValue}
                key={data.id}
              />
            ))}

          {isMeOutsideTop && me && (
            <div className="mt-4 border-t border-surfaceCards pt-4">
              <RacingLine
                position={myIndex + 1}
                racer={`${me.first_name} ${me.last_name}`}
                racerId={+me.id}
                dataValue={
                  mode === "hours" ? me.hours_worked : me.shifts_worked
                }
                maxValue={mode === "hours" ? maxHoursValue : maxShiftsValue}
                sufix={mode === "hours" ? "h" : undefined}
              />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Race;
