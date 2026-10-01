import { BellAlertIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useGetNextShift } from "../../hooks/useGetNextShift";
import { capitalize } from "../../helpers/capitalize";
import LoadingSpinner from "../LoadingSpinner";

function NextShiftCard() {
  const { data: nextShift, isLoading, isError } = useGetNextShift();

  if (isLoading) {
    return <LoadingSpinner size={14} />;
  }

  if (isError || !nextShift) {
    return (
      <div className="rounded-xl border border-borderDividers bg-cardLighterBG p-5">
        <div className="flex items-start gap-4  ">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
            <BellAlertIcon className="size-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-secondaryText">Next shift</p>
            <p className=" text-xl font-semibold text-primaryText">
              No upcoming shifts
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-borderDividers bg-cardLighterBG p-5">
      <div className="flex items-start gap-4  ">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
          <BellAlertIcon className="size-6 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-secondaryText">Next shift</p>
          <p className=" text-xl font-semibold text-primaryText">
            {format(nextShift.date, "EEEE, MMMM d")}
          </p>
          <p className="text-secondaryText text-xs">
            {capitalize(nextShift.shift_type)} shift
          </p>
          <p className="mt-1 text-xs  font-semibold text-primaryText">
            {nextShift.actual_start_time} - {nextShift.actual_end_time}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NextShiftCard;
