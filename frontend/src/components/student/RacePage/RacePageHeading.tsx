import PageHeading from "../../PageHeading";
import RaceDatePicker from "./RaceDatePicker";

function RacePageHeading({
  handleMonthChange,
  chosenMonth,
}: {
  handleMonthChange: (month: string) => void;
  chosenMonth: string;
}) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        <h2 className="text-primary font-semibold uppercase -mb-1">
          Race season · {chosenMonth}
        </h2>
        <PageHeading
          heading="Earnings"
          subheading="Your pay, your progress, and who's leading the pack this month."
        />
      </div>
      <div className="mr-12 flex flex-col gap-1.5">
        <RaceDatePicker handleMonthChange={handleMonthChange} />
      </div>
    </div>
  );
}

export default RacePageHeading;
