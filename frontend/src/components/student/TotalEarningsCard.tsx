import { WalletIcon } from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import type { MonthStats, UserStats } from "../../types/stats";

// "€454.75 (May)", or a dash when there are no months this year
function formatMonthEarnings(month: MonthStats | undefined) {
  if (!month) return "–";
  return `€${month.earnings} (${format(parseISO(month.month), "MMM")})`;
}

function TotalEarningsCard({ stats }: { stats: UserStats }) {
  const currentYear = new Date().getFullYear();
  const totalEarnings = stats.totalEarnings;
  const averageEarnings = stats.averageMonth.earnings;
  const currentYearMonths = stats.byMonth.filter((m) =>
    m.month.startsWith(`${currentYear}-`),
  );
  const highestEarningMonth = currentYearMonths.reduce<MonthStats | undefined>(
    (max, month) => (!max || month.earnings > max.earnings ? month : max),
    undefined,
  );

  const lowestEarningMonth = currentYearMonths.reduce<MonthStats | undefined>(
    (min, month) => (!min || month.earnings < min.earnings ? month : min),
    undefined,
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
            {formatMonthEarnings(highestEarningMonth)}
          </p>
        </div>
        <div className="pt-2 flex flex-row justify-between border-t border-t-borderDividers">
          <p className="text-secondaryText">Lowest month</p>
          <p className="text-primaryText">
            {formatMonthEarnings(lowestEarningMonth)}
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
