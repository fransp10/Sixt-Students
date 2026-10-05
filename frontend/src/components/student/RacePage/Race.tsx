import { useState } from "react";
import RaceHeader from "./Race/RaceHeader";
import RaceModePicker from "./Race/RaceModePicker";
import RacingLine from "./Race/RacingLine";
import type { RaceStats, RaceStatsStudent } from "../../../types/raceStats";
import { RACE_MAX_STUDENTS_TO_DISPLAY } from "../../../helpers/constants";

function Race({ raceStats }: { raceStats: RaceStats }) {
  const [mode, setMode] = useState<"hours" | "shifts">("hours");

  const raceDataHoursSorted = raceStats
    .sort(
      (a: RaceStatsStudent, b: RaceStatsStudent) =>
        b.hours_worked - a.hours_worked,
    )
    .slice(0, RACE_MAX_STUDENTS_TO_DISPLAY);
  const raceDataShiftsSorted = raceStats
    .sort(
      (a: RaceStatsStudent, b: RaceStatsStudent) =>
        b.shifts_worked - a.shifts_worked,
    )
    .slice(0, RACE_MAX_STUDENTS_TO_DISPLAY);

  const maxHoursValue = Math.max(
    ...raceStats.map((student: RaceStatsStudent) => student.hours_worked),
  );
  const maxShiftsValue = Math.max(
    ...raceStats.map((student: RaceStatsStudent) => student.shifts_worked),
  );

  return (
    <div className=" col-span-2 row-span-2  flex flex-col bg-cardLighterBG rounded-lg p-6 text-primaryText">
      <div className="flex flex-row justify-between items-center">
        <RaceHeader />
        <RaceModePicker handleChangeMode={setMode} mode={mode} />
      </div>
      <div>
        <ul className="flex flex-col gap-4 mt-6">
          {mode === "hours" &&
            raceDataHoursSorted.map((data, index) => (
              <RacingLine
                dataValue={data.hours_worked}
                position={index + 1}
                racer={data.first_name + " " + data.last_name}
                racerId={+data.id}
                maxValue={maxHoursValue}
                key={index}
                sufix="h"
              />
            ))}
          {mode === "shifts" &&
            raceDataShiftsSorted.map((data, index) => (
              <RacingLine
                dataValue={data.shifts_worked}
                racerId={+data.id}
                position={index + 1}
                racer={data.first_name + " " + data.last_name}
                maxValue={maxShiftsValue}
                key={index}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Race;
