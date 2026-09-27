import { format } from "date-fns";

type calendarHeaderColumnType = {
  day: Date;
  isCurrentDay: boolean;
};

function CalendarHeaderColumn({ day, isCurrentDay }: calendarHeaderColumnType) {
  const dayName = format(day, "EEE");
  const dayNumber = format(day, "LLL dd");
  return (
    <th className="bg-headersCalendar  border border-borderDividers text-primaryText items-center justify-center gap-2">
      <p
        className={`text-lg font-semibold uppercase ${isCurrentDay && "text-primary"}`}
      >
        {dayName}
      </p>
      <div className="h-8 flex items-center justify-center">
        {isCurrentDay ? (
          <p className="text-lg bg-primary rounded-full size-8  flex items-center justify-center text-white ">
            {format(dayNumber, "d")}
          </p>
        ) : (
          <p className="text-sm ">{dayNumber}</p>
        )}
      </div>
    </th>
  );
}

export default CalendarHeaderColumn;
