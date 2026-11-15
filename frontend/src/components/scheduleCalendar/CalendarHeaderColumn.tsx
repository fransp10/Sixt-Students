import { format } from "date-fns";

type calendarHeaderColumnType = {
  day: Date;
  isCurrentDay: boolean;
};

function CalendarHeaderColumn({ day, isCurrentDay }: calendarHeaderColumnType) {
  return (
    <div
      role="columnheader"
      aria-current={isCurrentDay ? "date" : undefined}
      className="flex flex-col gap-1 px-1 pb-1 text-primaryText"
    >
      <span
        className={`text-sm font-medium ${isCurrentDay ? "text-primary" : "text-secondaryText"}`}
      >
        {format(day, "EEE")}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`flex size-9 items-center justify-center rounded-full text-lg font-semibold tabular-nums ${isCurrentDay ? "bg-primary text-white" : ""}`}
        >
          {format(day, "d")}
        </span>
        <span className="text-sm text-secondaryText">{format(day, "LLL")}</span>
      </div>
    </div>
  );
}

export default CalendarHeaderColumn;
