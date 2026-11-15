import { useAuthContext } from "../../../hooks/auth/useAuthContext";
import type { RaceStats, RaceStatsStudent } from "../../../types/raceStats";
import CarIcon from "./Race/Car";
import RacePageCardHeader from "./RacePageCardHeader";

function Overtake({ raceStats }: { raceStats: RaceStats }) {
  const { currentUser } = useAuthContext();

  if (!currentUser) {
    return <div>Error: User not found.</div>;
  }

  const meIndex = raceStats.findIndex(
    (racer) => Number(racer.id) === currentUser.id,
  );
  if (meIndex === -1) {
    return (
      <div className="col-span-1 md:col-span-2 md:row-span-2 flex flex-col bg-cardLighterBG rounded-lg p-6 text-primaryText ">
        <RacePageCardHeader heading="Overtake" subheading="No data" />
        <p className="text-sm text-secondaryText h-full items-center justify-center flex">
          No data found for this month's race. Start working to see overtake
          data here
        </p>
      </div>
    );
  }

  const me = raceStats[meIndex];
  const inFront = raceStats[meIndex - 1] as RaceStatsStudent | undefined;
  const behind = raceStats[meIndex + 1] as RaceStatsStudent | undefined;
  const position = meIndex + 1;

  const gapAhead = inFront ? inFront.hours_worked - me.hours_worked : null;
  const gapBehind = behind ? me.hours_worked - behind.hours_worked : null;

  const cars = [
    behind && { ...behind, left: 20 },
    { ...me, left: 50 },
    inFront && { ...inFront, left: 80 },
  ].filter((c) => c !== undefined);

  const youPercentage = 50;
  const averageShiftHours = Math.round(me.hours_worked / me.shifts_worked);
  const shiftsToOvertake = Math.max(
    1,
    Math.ceil((gapAhead ?? 0) / averageShiftHours),
  );

  const fmt = (n: number) => Math.round(n * 10) / 10;

  return (
    <div className="md:col-span-2 row-span-2 flex flex-col bg-cardLighterBG rounded-lg p-6 text-primaryText ">
      <RacePageCardHeader
        heading="Overtake"
        subheading={`You're in P${position}`}
      />
      <div className="flex flex-col xl:flex-row   w-full mt-4 items-center">
        {/* TEXT */}
        <div className="flex flex-col gap-1 text-sm  text-left w-full flex-1 p-4">
          <div>
            <p className="text-xl font-bold text-primary">P{position}</p>
            <span className="text-xl font-bold">You're </span>
            <span className="text-xl font-bold text-primary">
              {gapAhead === null
                ? "in the lead"
                : gapAhead === 0
                  ? `level with ${inFront?.first_name}`
                  : `${fmt(gapAhead)}h `}
            </span>
            {gapAhead !== null && gapAhead > 0 && (
              <span className="text-xl font-bold">
                behind {inFront?.first_name} {inFront?.last_name[0]}.
              </span>
            )}
          </div>

          {position > 1 && gapAhead !== null && (
            <span className="text-sm text-secondaryText">
              Your average shift is {averageShiftHours}h. {shiftsToOvertake}{" "}
              more {shiftsToOvertake > 1 ? " shifts" : " shift"} and you take P
              {position - 1}.
            </span>
          )}
          {position < raceStats.length && gapBehind !== null ? (
            <span className="text-sm text-secondaryText">
              {behind?.first_name} {behind?.last_name[0]} is {fmt(gapBehind)}h
              behind you. Keep the gap.
            </span>
          ) : (
            <span className="text-sm text-secondaryText">
              No one is behind you
            </span>
          )}
        </div>
        {/* GAP */}
        <div className="w-full xl:w-2/5 xl:shrink-0 h-16 bg-headersCalendar justify-center relative rounded-lg">
          <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-icons/50 " />
          {cars.map((car) => (
            <CarIcon
              key={car.id}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${car.left}%` }}
            />
          ))}

          {gapAhead !== null && gapAhead > 0 && inFront && (
            <div
              className="absolute h-10 top-1/2 -translate-y-1/2 rounded-md border border-dashed border-primary bg-primary/15"
              style={{
                left: `${youPercentage}%`,
                width: `${33}%`,
              }}
            >
              <span className="p-1 px-4 bg-cardBG text-primary font-bold absolute -translate-x-1/2  -translate-y-1/2 left-1/2 rounded-md">
                +{fmt(gapAhead)}h
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Overtake;
