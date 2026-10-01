import { WalletIcon } from "@heroicons/react/24/outline";
import type { UserStats } from "../../types/stats";

function TotalEarningsCard({ stats }: { stats: UserStats }) {
  const currentYear = new Date().getFullYear();
  const totalEarnings = stats.totalEarnings;
  const averageEarnings = stats.averageMonth.earnings;
  const highestEarningMonth = stats.byMonth[currentYear].reduce(
    (max, month) => (month.earnings > max.earnings ? month : max),
    stats.byMonth[currentYear][0],
  );

  const lowestEarningMonth = stats.byMonth[currentYear].reduce(
    (min, month) => (month.earnings < min.earnings ? month : min),
    stats.byMonth[currentYear][0],
  );

  return (
    <div className="flex flex-col  border border-borderDividers rounded-xl h-full p-5 gap-4 text-primaryText relative  ">
      <div className="flex flex-row gap-4">
        <WalletIcon className="size-14 text-primary" />
        <div>
          <p className="text-base text-secondaryText">Total earnings</p>
          <p className="text-2xl text-primaryText">€{totalEarnings}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4  text-primaryText">
        <div className="pt-2 flex flex-row justify-between border-t border-t-borderDividers">
          <p className="text-secondaryText">Average per month</p>
          <p className="text-primaryText">€{averageEarnings}</p>
        </div>
        <div className="pt-2 flex flex-row justify-between border-t border-t-borderDividers">
          <p className="text-secondaryText">Highest month</p>
          <p className="text-primaryText">
            €{highestEarningMonth.earnings}{" "}
            {`(${highestEarningMonth.month.slice(0, 3)})`}
          </p>
        </div>
        <div className="pt-2 flex flex-row justify-between border-t border-t-borderDividers">
          <p className="text-secondaryText">Lowest month</p>
          <p className="text-primaryText">
            {" "}
            €{lowestEarningMonth.earnings}{" "}
            {`(${lowestEarningMonth.month.slice(0, 3)})`}
          </p>
        </div>
      </div>
      <span className="text-secondaryText text-xs top-4 right-4 absolute">
        This year
      </span>
    </div>
  );
}

export default TotalEarningsCard;
