import { useEffect, useRef, useState } from "react";
import { addMonths, format, isSameMonth, startOfMonth } from "date-fns";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import MonthPickerPopover from "./MonthPickerPopover";
import { CONTRACTS_FIRST_MONTH } from "../../../helpers/constants";

type PeriodBarProps = {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
};

function PeriodBar({ selectedMonth, onMonthChange }: PeriodBarProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const currentMonth = startOfMonth(new Date());
  const isCurrentMonth = isSameMonth(selectedMonth, currentMonth);
  const isFirstMonth = isSameMonth(selectedMonth, CONTRACTS_FIRST_MONTH);

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
        <span>Showing contracts for</span>
        {isCurrentMonth ? (
          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs text-success">
            Current month
          </span>
        ) : (
          <span className="rounded-full border border-borderDividers px-2 py-0.5 text-xs">
            Past month
          </span>
        )}
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <button
          type="button"
          aria-label="Previous month"
          disabled={isFirstMonth}
          onClick={() => onMonthChange(addMonths(selectedMonth, -1))}
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
            />
          )}
        </div>

        <button
          type="button"
          aria-label="Next month"
          disabled={isCurrentMonth}
          onClick={() => onMonthChange(addMonths(selectedMonth, 1))}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-borderDividers text-icons cursor-pointer transition-colors hover:bg-borderDividers disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default PeriodBar;
