import { StarIcon } from "@heroicons/react/24/outline";
import { CloudIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";

function FavoriteShiftTypeCard() {
  const favoriteShiftType = "Morning Shift"; // Replace with actual data source

  const Icon =
    favoriteShiftType === "Morning Shift"
      ? SunIcon
      : favoriteShiftType === "Middle"
        ? CloudIcon
        : MoonIcon; // Replace with actual icon mapping

  return (
    <div className=" h-full flex flex-col  text-primaryText p-4 border border-borderDividers rounded-xl">
      <div className="flex flex-row items-center gap-2">
        <StarIcon className="size-10 text-primary fill-primary" />
        <p className="text-xl ">Favorite shift type</p>
      </div>

      <div className="flex flex-col items-center justify-center  gap-1 flex-1 ">
        <Icon className="size-14 text-primary" />
        <p className="text-2xl">{favoriteShiftType}</p>
        <p className="text-md text-secondaryText text-center mt-2">
          You've worked 5 {favoriteShiftType.toLowerCase()} this month. Keep it
          up!
        </p>
        <p className="text-secondaryText">48% of your shifts this month</p>
      </div>
    </div>
  );
}

export default FavoriteShiftTypeCard;
