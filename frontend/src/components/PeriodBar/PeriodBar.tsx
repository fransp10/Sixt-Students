import { useEffect, useRef, useState } from "react";
import {
  addMonths,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import MonthPickerPopover from "./MonthPickerPopover";
import { CONTRACTS_FIRST_MONTH } from "../../helpers/constants";

type PeriodBarProps = {
  label?: string;
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
  minMonth?: Date;
  maxMonth?: Date;
  isMonthSelectable?: (month: Date) => boolean; // extra rule for months between min and max
};

function PeriodBar({
  label = "Showing contracts for",
  selectedMonth,
  onMonthChange,
  minMonth = CONTRACTS_FIRST_MONTH,
  maxMonth = startOfMonth(new Date()),
  isMonthSelectable = () => true,
}: PeriodBarProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const currentMonth = startOfMonth(new Date());
  const isCurrentMonth = isSameMonth(selectedMonth, currentMonth);
  const isUpcomingMonth = isAfter(selectedMonth, currentMonth);

  // arrows skip over months that can't be selected
  function findSelectableMonth(step: 1 | -1) {
    let month = addMonths(selectedMonth, step);

    while (!isBefore(month, minMonth) && !isAfter(month, maxMonth)) {
      if (isMonthSelectable(month)) return month;
      month = addMonths(month, step);
    }

    return null;
  }

  const previousMonth = findSelectableMonth(-1);
  const nextMonth = findSelectableMonth(1);

  useEffect(() => {
    if (!isPickerOpen) return;

    function handleMouseDown(e: MouseEvent) {
      if (!pickerRef.current?.contains(e.target as Node)) {
        setIsPickerOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsPickerOpen(false);
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPickerOpen]);

  function handleSelect(month: Date) {
    onMonthChange(month);
    setIsPickerOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-borderDividers bg-cardBG px-3 py-2.5">
      <div className="flex items-center gap-2 text-sm text-secondaryText">
        <span>{label}</span>
        {isCurrentMonth && (
          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs text-success">
            Current month
          </span>
        )}
        {isUpcomingMonth && (
          <span className="rounded-full border border-pending/30 bg-pending/10 px-2 py-0.5 text-xs text-pending">
            Upcoming month
          </span>
        )}
        {!isCurrentMonth && !isUpcomingMonth && (
          <span className="rounded-full border border-borderDividers px-2 py-0.5 text-xs">
            Past month
          </span>
        )}
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!previousMonth}
          onClick={() => previousMonth && onMonthChange(previousMonth)}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-borderDividers text-icons cursor-pointer transition-colors hover:bg-borderDividers disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        <div ref={pickerRef} className="relative flex-1 sm:flex-none">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isPickerOpen}
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-borderDividers bg-cardLighterBG px-3 text-sm font-semibold text-primaryText cursor-pointer transition-colors hover:border-primary/50 sm:w-48"
          >
            <CalendarIcon className="size-4 text-primary" />
            {format(selectedMonth, "MMMM yyyy")}
            <ChevronDownIcon className="size-4 text-secondaryText" />
          </button>

          {isPickerOpen && (
            <MonthPickerPopover
              selectedMonth={selectedMonth}
              onSelect={handleSelect}
              minMonth={minMonth}
              maxMonth={maxMonth}
              isMonthSelectable={isMonthSelectable}
            />
          )}
        </div>

        <button
          type="button"
          aria-label="Next month"
          disabled={!nextMonth}
          onClick={() => nextMonth && onMonthChange(nextMonth)}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-borderDividers text-icons cursor-pointer transition-colors hover:bg-borderDividers disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default PeriodBar;
