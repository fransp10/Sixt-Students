import { BellAlertIcon } from "@heroicons/react/24/outline";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import { useGetNextShift } from "../../hooks/useGetNextShift";
import { capitalize } from "../../helpers/capitalize";
import { getColorForShiftType } from "../../helpers/getColorForShiftType";

const cardClasses =
  "group flex h-full flex-col rounded-xl border border-borderDividers bg-cardBG p-5 transition-colors hover:border-primary/40 sm:col-span-2 xl:col-span-1";

function relativeDay(daysAway: number) {
  if (daysAway <= 0) return "Today";
  if (daysAway === 1) return "Tomorrow";
  return `In ${daysAway} days`;
}

function NextShiftHeader() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <BellAlertIcon className="size-5 text-primary" />
      </div>
      <p className="truncate text-sm font-medium text-secondaryText">
        Next shift
      </p>
    </div>
  );
}

function NextShiftCard() {
  const { data: nextShift, isLoading, isError } = useGetNextShift();

  if (isLoading) {
    return (
      <div
        className="flex h-full animate-pulse flex-col rounded-xl border border-borderDividers bg-cardBG p-5 sm:col-span-2 xl:col-span-1"
        aria-busy="true"
      >
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-darkBackground" />
          <div className="h-3 w-20 rounded bg-darkBackground" />
        </div>
        <div className="mt-5">
          <div className="h-7 w-28 rounded bg-darkBackground" />
          <div className="mt-2 h-4 w-32 rounded bg-darkBackground" />
          <div className="mt-3 h-4 w-24 rounded bg-darkBackground" />
        </div>
      </div>
    );
  }

  if (isError || !nextShift) {
    return (
      <Link to="/student/schedule" className={cardClasses}>
        <NextShiftHeader />
        <div className="mt-5">
          <p className="text-lg font-semibold text-primaryText">
            No upcoming shifts
          </p>
          <p className="mt-1 text-sm text-secondaryText">
            Request shifts on your schedule
          </p>
        </div>
      </Link>
    );
  }

  const daysAway = differenceInCalendarDays(nextShift.date, new Date());
  const isToday = daysAway <= 0;

  return (
    <Link to="/student/schedule" className={cardClasses}>
      <NextShiftHeader />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p
            className={`text-2xl font-semibold ${isToday ? "text-primary" : "text-primaryText"}`}
          >
            {relativeDay(daysAway)}
          </p>
          <p className="mt-0.5 text-sm text-secondaryText">
            {format(nextShift.date, "EEEE, d MMM")}
          </p>
        </div>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: getColorForShiftType(nextShift.shift_type) }}
            aria-hidden="true"
          />
          <span className="font-semibold tabular-nums text-primaryText">
            {nextShift.actual_start_time} – {nextShift.actual_end_time}
          </span>
          <span className="text-secondaryText">
            {capitalize(nextShift.shift_type)}
          </span>
        </p>
      </div>
    </Link>
  );
}

export default NextShiftCard;
