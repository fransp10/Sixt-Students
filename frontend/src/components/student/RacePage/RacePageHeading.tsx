import { format } from "date-fns";
import PageHeading from "../../PageHeading";
import RaceDatePicker from "./RaceDatePicker";

function RacePageHeading({
  handleMonthChange,
  chosenMonth,
}: {
  handleMonthChange: (month: string) => void;
  chosenMonth: string;
}) {
  const [year, month] = chosenMonth.split("-").map(Number);

  return (
    <div className="flex flex-col justify-between  sm:flex-row gap-4">
      <div>
        <h2 className="text-primary font-semibold uppercase -mb-1">
          Race season · {format(new Date(year, month - 1), "MMMM yyyy")}
        </h2>
        <PageHeading
          heading="Earnings"
          subheading="Your pay, your progress, and who's leading the pack this month."
        />
      </div>
      <div className="w-full sm:w-auto flex flex-col gap-1.5">
        <RaceDatePicker
          chosenMonth={chosenMonth}
          handleMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
}

export default RacePageHeading;
