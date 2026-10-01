import { format } from "date-fns";
import PageHeading from "../components/PageHeading";
import RaceDatePicker from "../components/student/RacePage/RaceDatePicker";
import RaceEarningsMonthlyGoal from "../components/student/RacePage/RaceEarningsMonthlyGoal";
import Odometer from "../components/student/RacePage/Odometer";
import Gear from "../components/student/RacePage/Gear";
import Race from "../components/student/RacePage/Race";
import Podium from "../components/student/RacePage/Podium";
import Laps from "../components/student/RacePage/Laps";
const currentMonth = format(new Date(), "MMMM yyyy");
function EarningsPage() {
  return (
    <div className=" flex flex-col gap-4">
      <RacePageHeading />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <RaceEarningsMonthlyGoal earned={400} goal={600} />
        <Odometer />
        <Gear />
        <Race />
        <Podium />
        <Laps />
      </div>
    </div>
  );
}

export default EarningsPage;

function RacePageHeading() {
  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        <h2 className="text-primary font-semibold uppercase -mb-1">
          Race season · {currentMonth}{" "}
        </h2>
        <PageHeading
          heading="Earnings"
          subheading="Your pay, your progress, and who's leading the pack this month."
        />
      </div>
      <div className="mr-12 flex flex-col gap-1.5">
        <RaceDatePicker />
      </div>
    </div>
  );
}
