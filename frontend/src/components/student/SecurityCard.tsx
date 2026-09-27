import { LockClosedIcon } from "@heroicons/react/24/outline";

function SecurityCard() {
  return (
    <div className="p-6 bg-cardBg border-borderDividers border rounded-xl text-primaryText">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <div>
            <LockClosedIcon className="size-8 sm:size-10" />
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-semibold">
              Account information
            </p>
            <p className="text-xs sm:text-md text-secondaryText">
              This information is managed by your administrator.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-6 border border-borderDividers bg-cardLighterBG rounded-xl mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 ">
          <div className="flex flex-col">
            <span className="font-semibold">Password</span>
            <span className="text-sm text-secondaryText">
              Update your password regularly to keep your account safe.
            </span>
          </div>
          <button className="p-2 px-6 w-full sm:w-auto bg-primary cursor-pointer hover:bg-primary/80 rounded-xl text-nowrap">
            Change password
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecurityCard;
