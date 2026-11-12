import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import type { ContractMonth } from "../../../helpers/studentContractMonths";

const chevronButtonClass =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-borderDividers text-icons cursor-pointer transition-colors hover:bg-borderDividers disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

function Verdict({ year, months }: { year: number; months: ContractMonth[] }) {
  if (months.length === 0) return null;

  const missing = months.filter(
    (m) => m.status === "missing" || m.status === "closed",
  );
  const canStillFix = missing.some((m) => m.status === "missing");

  if (missing.length === 0) {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-success">
        <CheckCircleIcon className="size-5 shrink-0" />
        All {year} contracts are in
      </p>
    );
  }

  // oldest first, so the list reads like the calendar
  const names = [...missing].reverse().map((m) => format(m.month, "MMM"));
  const shown =
    names.length > 3
      ? `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`
      : names.join(", ");

  return (
    <p
      className={`flex items-center gap-2 text-sm ${canStillFix ? "text-warning" : "text-secondaryText"}`}
    >
      <ExclamationCircleIcon className="size-5 shrink-0" />
      <span>
        <span
          className={`font-medium ${canStillFix ? "" : "text-primaryText"}`}
        >
          {missing.length} {missing.length === 1 ? "contract" : "contracts"}{" "}
          missing
        </span>
        <span className="text-secondaryText"> · {shown}</span>
      </span>
    </p>
  );
}

function StudentContractsToolbar({
  year,
  firstYear,
  lastYear,
  months,
  onYearChange,
}: {
  year: number;
  firstYear: number;
  lastYear: number;
  months: ContractMonth[];
  onYearChange: (year: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={year <= firstYear}
          onClick={() => onYearChange(year - 1)}
          className={chevronButtonClass}
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <div className="flex h-9 w-36 items-center justify-center gap-2 rounded-lg border border-borderDividers bg-cardLighterBG px-3 text-sm font-semibold text-primaryText">
          <CalendarDaysIcon className="size-4 text-primary" />
          {year}
        </div>
        <button
          type="button"
          disabled={year >= lastYear}
          onClick={() => onYearChange(year + 1)}
          className={chevronButtonClass}
        >
          <ChevronRightIcon className="size-5" />
        </button>
        <button
          type="button"
          disabled={year === lastYear}
          onClick={() => onYearChange(lastYear)}
          className="h-9 shrink-0 rounded-lg border border-primary/40 px-3 text-sm text-primary cursor-pointer transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-borderDividers disabled:text-secondaryText disabled:opacity-30 disabled:hover:bg-transparent"
        >
          This year
        </button>
      </div>
      <Verdict year={year} months={months} />
    </div>
  );
}

export default StudentContractsToolbar;
