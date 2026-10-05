import type { UserStats } from "../../../types/stats";
import RacePageCardHeader from "./RacePageCardHeader";

const SEGMENTS = 10;

function getFuelColor(rate: number) {
  if (rate >= 80) return { bar: "bg-success", text: "text-success" };
  if (rate >= 60) return { bar: "bg-warning", text: "text-warning" };
  return { bar: "bg-danger", text: "text-danger" };
}

function FuelPumpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M3 21h12" />
      <path d="M7 7h4" />
      <path d="M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3" />
    </svg>
  );
}

function FuelGauge({
  stats,
  chosenMonthNumber,
  chosenYear,
}: {
  stats: UserStats;
  chosenMonthNumber: number;
  chosenYear: number;
}) {
  const chosenMonthData = stats.byMonth[chosenYear].find(
    (monthData) => monthData.monthNumber === chosenMonthNumber,
  );

  const rate = chosenMonthData?.attendanceRate ?? 0;
  const total = chosenMonthData?.assigned ?? 0;

  if (total === 0) {
    return (
      <div className="col-span-1 flex flex-col  gap-6 rounded-lg bg-cardLighterBG p-6 text-primaryText">
        <RacePageCardHeader heading="Fuel tank" subheading="Attendance" />
        <p className="text-sm  items-center flex justify-center h-full text-secondaryText">
          No shifts this month yet
        </p>
      </div>
    );
  }
  const attended = total - (chosenMonthData?.noShows ?? 0);

  const filled = Math.round((rate / 100) * SEGMENTS);
  const color = getFuelColor(rate);
  const isLow = rate < 60;

  return (
    <div className="col-span-1 flex flex-col gap-6 rounded-lg bg-cardLighterBG p-6 text-primaryText">
      <RacePageCardHeader heading="Fuel tank" subheading="Attendance" />

      <div className="flex flex-1 flex-col justify-center gap-4">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <FuelPumpIcon className={`size-9 ${color.text}`} />
            <span className="text-4xl font-bold">{rate}%</span>
          </div>

          {isLow && (
            <span className="rounded-md bg-danger/15 px-2 py-1 text-xs font-semibold uppercase  text-danger">
              Low fuel
            </span>
          )}
        </div>

        {/* segmented tank */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-secondaryText">E</span>
          <div className="flex flex-1 gap-1">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <div
                key={i}
                className={`h-8 flex-1 -skew-x-12 rounded-sm transition-colors duration-500 ${
                  i < filled ? color.bar : "bg-surfaceCards"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-secondaryText">F</span>
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

export default FuelGauge;
