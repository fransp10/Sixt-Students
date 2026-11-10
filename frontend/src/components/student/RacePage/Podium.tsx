import { TrophyIcon } from "@heroicons/react/24/outline";
import RacePageCardHeader from "./RacePageCardHeader";
import type { RaceStatsStudent } from "../../../types/raceStats";
import { format } from "date-fns";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";

const PLACE_STYLES = [
  {
    order: "order-2",
    height: "h-40",
    block: "bg-primary",
    trophy: "text-yellow-600 size-12",
  },
  {
    order: "order-1",
    height: "h-28",
    block: "bg-surfaceCards",
    trophy: "text-stone-400 size-10",
  },
  {
    order: "order-3",
    height: "h-20",
    block: "bg-borderDividers",
    trophy: "text-amber-900 size-8",
  },
];

function Podium({
  currentMonth,
  top3,
  surface = "bg-cardLighterBG rounded-lg",
}: {
  currentMonth: string;
  top3: RaceStatsStudent[];
  surface?: string;
}) {
  const currentUser = useAuthContext();
  if (top3.length === 0) {
    return (
      <div className={` col-span-1 row-span-2  flex flex-col p-6 text-primaryText ${surface}`}>
        <p>No data this month yet</p>
      </div>
    );
  }

  return (
    <div className={` col-span-1 row-span-2  flex flex-col p-6 text-primaryText ${surface}`}>
      <RacePageCardHeader
        heading="Podium"
        subheading={`Top performers ${format(new Date(currentMonth), "MMM yyyy")} `}
      />
      <div className=" md:col-span-2 flex flex-row w-full flex-1 items-end min-h-92 overflow-hidden justify-between gap-2">
        {top3.map((racer, i) => {
          const place = i + 1;
          const style = PLACE_STYLES[i];
          const isCurrentUser =
            Number(racer.id) === currentUser.currentUser?.id;
          return (
            <div
              key={racer.id}
              className={`flex flex-col items-center gap-1 flex-1 ${style.order}`}
            >
              <TrophyIcon className={style.trophy} />
              <span
                className={`truncate text-sm font-bold text-wrap text-center  ${isCurrentUser ? "text-primary" : ""}`}
              >
                {isCurrentUser
                  ? "You"
                  : racer.first_name + " " + racer.last_name}
              </span>
              <span className="text-secondaryText font-bold text-sm">
                {racer.hours_worked}h
              </span>
              <div
                className={`flex w-full  justify-center rounded-t-lg pt-2 text-2xl font-bold ${style.height} ${style.block}`}
              >
                {place}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Podium;
