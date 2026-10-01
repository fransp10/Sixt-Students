import { format } from "date-fns";
import type { UserStats } from "../../types/stats";

type Props = {
  byMonth: UserStats["byMonth"];
  value: Date;
  onChange: (date: Date) => void;
};

function DashBoardPageSelectMonth({ byMonth, value, onChange }: Props) {
  // one option per worked month, e.g. { value: "2026-10", label: "October 2026" }
  const options = Object.entries(byMonth).flatMap(([year, months]) =>
    months.map((m) => ({
      value: `${year}-${m.monthNumber}`,
      label: `${m.month} ${year}`,
    })),
  );
  const currentDate = new Date();
  const currentMonthOption = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

  const hasCurrentMonthOption = options.some(
    (o) => o.value === currentMonthOption,
  );
  return (
    <select
      value={`${value.getFullYear()}-${value.getMonth() + 1}`}
      onChange={(e) => {
        const [year, month] = e.target.value.split("-").map(Number);
        onChange(new Date(year, month - 1));
      }}
      className="h-10 rounded-lg border border-borderDividers bg-cardBG px-3 text-sm text-primaryText outline-none scheme-dark focus:border-pending"
    >
      <optgroup label="Months worked">
        {options.reverse().map((o) => (
          <option key={o.value} value={o.value}>
            {o.value === currentMonthOption ? `Current month` : o.label}
          </option>
        ))}
        {!hasCurrentMonthOption && (
          <option className="font-bold" value={currentMonthOption}>
            {format(currentDate, "MMMM")} {currentDate.getFullYear()} (Current)
          </option>
        )}
      </optgroup>
    </select>
  );
}

export default DashBoardPageSelectMonth;
