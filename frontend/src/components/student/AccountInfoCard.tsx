import { UserIcon } from "@heroicons/react/24/outline";

function AccountInfoCard() {
  return (
    <div className="p-4 sm:p-6 bg-cardBg border-borderDividers border rounded-xl text-primaryText">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 sm:gap-4">
          <div>
            <UserIcon className="size-8 sm:size-10" />
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
        <div className="p-2 sm:p-3 flex items-center justify-center rounded-full text-secondaryText bg-borderDividers">
          <p className="text-nowrap text-xs sm:text-sm font-semibold">
            Read only
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-6 border border-borderDividers bg-cardLighterBG rounded-xl mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3">
          <span className="text-secondaryText">Name</span>
          <span className="font-medium">Student Name</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3">
          <span className="text-secondaryText">Student ID</span>
          <span className="font-medium">STU-0012</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3">
          <span className="text-secondaryText">Started working</span>
          <span className="font-medium">Mar 22, 2024</span>
        </div>
      </div>
    </div>
  );
}

export default AccountInfoCard;
