import { UserIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { format } from "date-fns";

function AccountInfoCard() {
  const { currentUser } = useAuthContext();

  if (!currentUser) {
    return (
      <div>
        <h1>No user</h1>
      </div>
    );
  }

  console.log(currentUser.created_at);
  const fullName = currentUser.first_name + " " + currentUser.last_name;
  return (
    <div className="p-4 sm:p-6 bg-cardBg border-borderDividers border rounded-xl text-primaryText">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 sm:gap-4">
          <div>
            <UserIcon className="size-8 sm:size-10 text-primary" />
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-semibold text-primary">
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
          <span className="font-medium">{fullName}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3">
          <span className="text-secondaryText">Date of birth</span>
          <span className="font-medium">
            {currentUser.date_of_birth
              ? format(currentUser.date_of_birth, "MMMM dd, yyyy")
              : "Unknown"}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3">
          <span className="text-secondaryText">Student ID</span>
          <span className="font-medium">{currentUser?.id}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3">
          <span className="text-secondaryText">Started working</span>
          <span className="font-medium">
            {currentUser.created_at
              ? format(currentUser.created_at, "yyyy-mm-dd")
              : "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AccountInfoCard;
