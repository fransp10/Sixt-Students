import { BoltIcon } from "@heroicons/react/24/outline";
import type { UserStats } from "../../../types/stats";
import RacePageCardHeader from "./RacePageCardHeader";

const SEGMENTS = 10;

function getBoost(rate: number) {
  if (rate >= 90)
    return { label: "Full boost", bar: "bg-success", text: "text-success" };
  if (rate >= 60)
    return { label: "Spooling", bar: "bg-warning", text: "text-warning" };
  return { label: "Turbo lag", bar: "bg-danger", text: "text-danger" };
}

function Turbo({
  stats,
  chosenMonth,
}: {
  stats: UserStats;
  chosenMonth: string; // "yyyy-MM"
}) {
  const chosenMonthData = stats.byMonth.find(
    (monthData) => monthData.month === chosenMonth,
  );

  const rate = chosenMonthData?.attendanceRate ?? 0;
  const total = chosenMonthData?.assigned ?? 0;

  if (total === 0) {
    return (
      <div className="col-span-1 row-span-2 flex flex-col gap-6 rounded-lg bg-cardLighterBG p-6 text-primaryText">
        <RacePageCardHeader heading="Turbo" subheading="Attendance" />
        <p className="text-sm items-center flex justify-center h-full text-secondaryText">
          No shifts this month yet
        </p>
      </div>
    );
  }
  const attended = total - (chosenMonthData?.noShows ?? 0);

  const filled = Math.round((rate / 100) * SEGMENTS);
  const boost = getBoost(rate);

  return (
    <div className="col-span-1 row-span-2  flex flex-col gap-6 rounded-lg bg-cardLighterBG p-6 text-primaryText">
      <RacePageCardHeader heading="Turbo" subheading="Attendance" />

      <div className="flex flex-1 flex-col justify-center gap-4">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <BoltIcon className={`size-9 ${boost.text}`} />
            <span className="text-4xl font-bold">{rate}%</span>
          </div>

          <span
            className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${boost.text} bg-current/15`}
          >
            {boost.label}
          </span>
        </div>

        {/* boost meter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-secondaryText">0</span>
          <div className="flex flex-1 gap-1">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <div
                key={i}
                className={`h-8 flex-1 -skew-x-12 rounded-sm transition-colors duration-500 ${
                  i < filled ? boost.bar : "bg-surfaceCards"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-secondaryText">MAX</span>
        </div>

        <p className="text-sm text-secondaryText">
          Showed up to{" "}
          <span className="font-semibold text-primaryText">{attended}</span> of{" "}
          <span className="font-semibold text-primaryText">{total}</span> shifts
        </p>
      </div>
    </div>
  );
}

export default Turbo;
