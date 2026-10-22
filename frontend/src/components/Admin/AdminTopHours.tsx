import { useGetRaceStats } from "../../hooks/useGetRaceStats";
import { formatStat } from "../../helpers/formatStat";

function AdminTopHours() {
  const { data: standings, isLoading, isError } = useGetRaceStats();

  const leaderHours = standings?.[0]?.hours_worked ?? 0;

  return (
    <div className="flex flex-col gap-4 col-span-1 bg-cardBG h-120 p-4 rounded-lg ">
      <div>
        <h2 className="text-primaryText font-bold">Top hours</h2>
        <p className="text-xs text-secondaryText">All students · all time</p>
      </div>

      {isLoading && <p className="text-sm text-secondaryText">Loading...</p>}

      {isError && (
        <p className="text-sm text-secondaryText">
          Couldn't load the standings
        </p>
      )}

      {!isLoading && !isError && !standings?.length && (
        <p className="text-sm text-secondaryText">No worked shifts yet</p>
      )}

      {!!standings?.length && (
        <ol className="flex flex-col gap-3 overflow-y-auto pr-1">
          {standings.map((student, index) => {
            const hours = student.hours_worked;
            const width = leaderHours > 0 ? (hours / leaderHours) * 100 : 0;

            return (
              <li key={student.id} className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="shrink-0 text-xs font-semibold text-secondaryText">
                    #{index + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-primaryText">
                    {student.first_name} {student.last_name}
                  </p>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-primaryText">
                    {formatStat(hours, "h")}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-darkBackground">
                  <div
                    className="h-1 rounded-full bg-primary"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default AdminTopHours;
