import { format } from "date-fns";
import { useGetRaceMonths } from "../../../hooks/useGetRaceStats";

function RaceDatePicker({
  handleMonthChange,
  chosenMonth,
}: {
  handleMonthChange: (month: string) => void;
  chosenMonth: string;
}) {
  const { data: raceMonths, isLoading, isError } = useGetRaceMonths();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !raceMonths) {
    return <div>Error loading months.</div>;
  }

  return (
    <>
      <label htmlFor="month" className="text-sm text-secondaryText">
        Month
      </label>
      <select
        value={chosenMonth}
        onChange={(e) => {
          handleMonthChange(e.target.value);
        }}
        id="month"
        className="h-10 w-52 cursor-pointer rounded-lg border border-borderDividers bg-cardBG px-3 text-sm text-primaryText outline-none scheme-dark  transition-colors hover:border-secondaryText focus:border-pending "
      >
        {raceMonths.map((month) => (
          <option key={month} value={month}>
            {format(new Date(month), "MMMM yyyy")}
          </option>
        ))}
      </select>
    </>
  );
}

export default RaceDatePicker;
