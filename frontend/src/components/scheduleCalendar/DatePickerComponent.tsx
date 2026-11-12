import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";

type DatePickerComponentProps = {
  selectedDate: Date;
  onSwitchDate: (newDate: Date) => void;
  isCurrentWeek: boolean;
};

const stepButton =
  "flex size-10 cursor-pointer items-center justify-center text-primary transition-colors duration-200 hover:bg-primary/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary";

function DatePickerComponent({
  selectedDate,
  onSwitchDate,
  isCurrentWeek,
}: DatePickerComponentProps) {
  const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekStart = startOfWeek(selectedDate, {
    weekStartsOn: 1,
  });
  const weekEnd = endOfWeek(selectedDate, {
    weekStartsOn: 1,
  });
  const formattedDate = `${format(weekStart, "dd MMM")} - ${format(
    weekEnd,
    "dd MMM, yyyy",
  )}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-borderDividers px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CalendarIcon className="size-6" />
        </span>
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold tabular-nums leading-tight text-primaryText">
            {formattedDate}
          </h2>
          <span
            className={`text-sm ${isCurrentWeek ? "text-primary" : "text-secondaryText"}`}
          >
            {`Week ${format(weekStart, "I")}`}
          </span>
        </div>
      </div>
      <div
        role="group"
        aria-label="Change week"
        className="flex items-stretch divide-x divide-borderDividers overflow-hidden rounded-lg border border-borderDividers"
      >
        <button
          type="button"
          aria-label="Previous week"
          onClick={() => onSwitchDate(subWeeks(selectedDate, 1))}
          className={stepButton}
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <button
          type="button"
          disabled={isCurrentWeek}
          onClick={() => onSwitchDate(currentWeek)}
          className="h-10 px-5 text-sm font-medium text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary enabled:cursor-pointer enabled:hover:bg-primary enabled:hover:text-white disabled:cursor-default disabled:text-secondaryText"
        >
          Today
        </button>
        <button
          type="button"
          aria-label="Next week"
          onClick={() => onSwitchDate(addWeeks(selectedDate, 1))}
          className={stepButton}
        >
          <ArrowRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default DatePickerComponent;
