import { WalletIcon } from "@heroicons/react/24/outline";

function TotalEarningsCard() {
  return (
    <div className="flex flex-col  border border-borderDividers rounded-xl h-full p-5 gap-4 text-primaryText relative  ">
      <div className="flex flex-row gap-4">
        <WalletIcon className="size-14 text-primary" />
        <div>
          <p className="text-base text-secondaryText">Total earnings</p>
          <p className="text-2xl text-primaryText">€4320</p>
        </div>
      </div>
      <div className="flex flex-col gap-4  text-primaryText">
        <div className="pt-2 flex flex-row justify-between border-t border-t-borderDividers">
          <p className="text-secondaryText">Average per month</p>
          <p className="text-primaryText">€360</p>
        </div>
        <div className="pt-2 flex flex-row justify-between border-t border-t-borderDividers">
          <p className="text-secondaryText">Highest month</p>
          <p className="text-primaryText">€756 {"(Aug)"}</p>
        </div>
        <div className="pt-2 flex flex-row justify-between border-t border-t-borderDividers">
          <p className="text-secondaryText">Lowest month</p>
          <p className="text-primaryText">€320 {"(Jan)"}</p>
        </div>
      </div>
      <span className="text-secondaryText text-xs top-4 right-4 absolute">
        This year
      </span>
    </div>
  );
}

export default TotalEarningsCard;
