import { StarIcon } from "@heroicons/react/24/outline";
import { CloudIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useGetUserStats } from "../../hooks/useGetUserStats";
import { capitalize } from "../../helpers/capitalize";

function FavoriteShiftTypeCard({ userId }: { userId?: string }) {
  const stats = useGetUserStats(userId);

  if (!stats.data?.byShiftTypes.length || stats.isLoading || stats.isError) {
    return (
      <div className=" h-full flex flex-col  text-primaryText p-4 border border-borderDividers rounded-xl">
        <div className="flex flex-row items-center gap-2">
          <StarIcon className="size-10 text-primary fill-primary" />
          <p className="text-xl  ">Favorite shift type</p>
        </div>
        <div className="flex flex-col items-center justify-center  gap-1 flex-1 text-xs min-h-32">
          <p className="text-secondaryText">No shift data yet.</p>
          {!userId && (
            <p className="text-secondaryText text-center">
              Start working to see your favorite shift type and other stats!
            </p>
          )}
        </div>
      </div>
    );
  }

  const favoriteShiftType = stats.data?.byShiftTypes.reduce((prev, current) =>
    prev.hours > current.hours ? prev : current,
  )?.shift_name;

  const totalHoursWorkedInFavoriteShiftType =
    stats.data?.byShiftTypes.find(
      (shift) => shift.shift_name === favoriteShiftType,
    )?.hours || 0;

  const percantageOfShiftsInFavoriteShiftType = Math.round(
    (totalHoursWorkedInFavoriteShiftType / (stats.data?.totalHours ?? 0)) * 100,
  );

  const Icon =
    favoriteShiftType === "morning"
      ? SunIcon
      : favoriteShiftType === "middle"
        ? CloudIcon
        : MoonIcon;

  return (
    <div className=" h-full flex flex-col  text-primaryText p-4 border border-borderDividers rounded-xl">
      <div className="flex flex-row items-center gap-2">
        <StarIcon className="size-10 text-primary fill-primary" />
        <p className="text-xl ">Favorite shift type</p>
      </div>

      <div className="flex flex-col items-center justify-center  gap-1 flex-1 ">
        <Icon className="size-14 text-primary" />
        <p className="text-2xl">{capitalize(favoriteShiftType!)}</p>
        {!userId && (
          <>
            <p className="text-md text-secondaryText text-center mt-2">
              You've worked 5 {capitalize(favoriteShiftType!)} shifts.
            </p>
            <p className="text-md text-secondaryText text-center">
              Keep it up!
            </p>
          </>
        )}
        <p className="text-secondaryText">
          That is {percantageOfShiftsInFavoriteShiftType}% of{" "}
          {userId ? "their" : "your"} shifts.
        </p>
      </div>
    </div>
  );
}

export default FavoriteShiftTypeCard;
