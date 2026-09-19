import { BellAlertIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

function NextShiftCard() {
  const shift = {
    title: "Morning Shift",
    value: "8:00 AM - 12:00 PM",
    date: "2026-06-15",
  };
  return (
    <div className="rounded-xl border border-borderDividers bg-cardLighterBG p-5">
      <div className="flex items-start gap-4  ">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
          <BellAlertIcon className="size-6 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-secondaryText">Next shift</p>
          <p className=" text-xl font-semibold text-primaryText">
            {format(shift.date, "E, MMMM d")}
          </p>
          <p className="mt-1 text-xs  font-semibold text-primaryText">
            {shift.value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NextShiftCard;
