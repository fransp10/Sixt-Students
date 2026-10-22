import { useState } from "react";
import {
  eachMonthOfInterval,
  format,
  getYear,
  isAfter,
  isBefore,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type MonthPickerPopoverProps = {
  selectedMonth: Date;
  onSelect: (month: Date) => void;
  minMonth: Date;
  maxMonth: Date;
  isMonthSelectable: (month: Date) => boolean;
};

function MonthPickerPopover({
  selectedMonth,
  onSelect,
  minMonth,
  maxMonth,
  isMonthSelectable,
}: MonthPickerPopoverProps) {
  const [viewYear, setViewYear] = useState(getYear(selectedMonth));

  const currentMonth = startOfMonth(new Date());
  const firstYear = getYear(minMonth);
  const lastYear = getYear(maxMonth);

  const months = eachMonthOfInterval({
    start: new Date(viewYear, 0, 1),
    end: new Date(viewYear, 11, 1),
  });

  return (
    <div className="absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-xl border border-surfaceCards bg-cardLighterBG p-3 shadow-lg">
      {/* Year switcher */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous year"
          disabled={viewYear <= firstYear}
          onClick={() => setViewYear(viewYear - 1)}
          className="flex size-8 items-center justify-center rounded-lg border border-borderDividers text-icons cursor-pointer hover:bg-borderDividers disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <span className="text-sm font-semibold text-primaryText">
          {viewYear}
        </span>
        <button
          type="button"
          aria-label="Next year"
          disabled={viewYear >= lastYear}
          onClick={() => setViewYear(viewYear + 1)}
          className="flex size-8 items-center justify-center rounded-lg border border-borderDividers text-icons cursor-pointer hover:bg-borderDividers disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      {/* Month grid */}
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {months.map((month) => {
          const isSelected = isSameMonth(month, selectedMonth);
          const isDisabled =
            isAfter(month, maxMonth) ||
            isBefore(month, minMonth) ||
            !isMonthSelectable(month);

          return (
            <button
              key={month.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(month)}
              className={`h-9 rounded-lg border text-sm cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-surfaceCards ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent text-primaryText enabled:hover:bg-darkBackground"
              }`}
            >
              {format(month, "MMM")}
            </button>
          );
        })}
      </div>

      {!isSameMonth(selectedMonth, currentMonth) && (
        <div className="mt-3 flex justify-end border-t border-borderDividers pt-2">
          <button
            type="button"
            onClick={() => onSelect(currentMonth)}
            className="text-xs font-semibold text-primary cursor-pointer hover:underline"
          >
            This month
          </button>
        </div>
      )}
    </div>
  );
}

export default MonthPickerPopover;
