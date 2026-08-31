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
    <div className=" flex items-center col-span-8 border border-borderDividers p-8 ">
      <div className="flex flex-1 gap-2  text-primaryText  items-center justify-around    ">
        <button
          onClick={() => onSwitchDate(subWeeks(selectedDate, 1))}
          className="hover:cursor-pointer border-borderDividers border size-12 flex items-center justify-center rounded text-primary hover:border-primary transition-all duration-300"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <div className="flex items-center ">
          <CalendarIcon className="size-12 shrink-0 text-primary" />
          <div className="flex flex-col items-center justify-center  w-72 text-nowrap ">
            <span
              className={`flex items-center justify-center text-2xl font-semibold`}
            >
              {formattedDate}
            </span>
            <span
              className={`${isCurrentWeek ? "text-primary " : ""}`}
            >{`Week ${format(weekStart, "I")}`}</span>
          </div>
        </div>
        <button
          onClick={() => onSwitchDate(addWeeks(selectedDate, 1))}
          className="hover:cursor-pointer border-borderDividers border size-12 flex items-center justify-center rounded text-primary hover:border-primary transition-all duration-300"
        >
          <ArrowRightIcon className="size-6 " />
        </button>
      </div>
      <div className="flex items-center justify-center w-24 ">
        <button
          disabled={isCurrentWeek}
          onClick={() => onSwitchDate(currentWeek)}
          className=" h-12 w-24   hover:text-primaryText transition-all duration-300 text-primary  rounded-lg border  enabled:cursor-pointer enabled:hover:bg-primary enabled:hover:text-primaryText enabled:hover:border-primary disabled:cursor-default disabled:border-borderDividers disabled:text-secondaryText
        "
        >
          Today
        </button>
      </div>
    </div>
  );
}

export default DatePickerComponent;
