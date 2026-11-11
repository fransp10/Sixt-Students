import { LockClosedIcon } from "@heroicons/react/24/outline";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { getAvatarColor, getInitials } from "../../helpers/helpers";

const DATE_FORMAT = "MMMM d, yyyy";

function AccountInfoCard() {
  const { currentUser } = useAuthContext();

  if (!currentUser) return null;

  const fullName = currentUser.first_name + " " + currentUser.last_name;
  // e.g. "2 years, 8 months"
  const timeWorked = currentUser.created_at
    ? formatDuration(
        intervalToDuration({ start: currentUser.created_at, end: new Date() }),
        { format: ["years", "months"], delimiter: ", " },
      ) || "Less than a month"
    : "Unknown";

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-borderDividers bg-cardBG p-5">
      {/* same avatar as CurrentUserBadge in the nav */}
      <div className="flex items-center gap-4">
        <span
          className={`${getAvatarColor(currentUser.id)} flex size-14 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white`}
        >
          {getInitials(fullName)}
        </span>
        <div className="min-w-0">
          <h2
            id="profile-heading"
            className="truncate text-lg font-semibold text-primaryText"
          >
            {fullName}
          </h2>
          <p className="text-sm capitalize text-secondaryText">
            {currentUser.user_role}
          </p>
        </div>
      </div>

      <dl className="flex flex-col divide-y divide-borderDividers border-y border-borderDividers">
        <div className="flex items-center justify-between gap-4 py-3 text-sm">
          <dt className="text-secondaryText">Student ID</dt>
          <dd className="font-medium text-primaryText">{currentUser.id}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3 text-sm">
          <dt className="text-secondaryText">Date of birth</dt>
          <dd className="font-medium text-primaryText">
            {currentUser.date_of_birth
              ? format(currentUser.date_of_birth, DATE_FORMAT)
              : "Unknown"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-3 text-sm">
          <dt className="text-secondaryText">Working since</dt>
          <dd className="text-right">
            <span className="block font-medium text-primaryText">
              {currentUser.created_at
                ? format(currentUser.created_at, DATE_FORMAT)
                : "Unknown"}
            </span>
            {timeWorked && (
              <span className="block text-xs text-secondaryText">
                {timeWorked}
              </span>
            )}
          </dd>
        </div>
      </dl>

      <p className="flex gap-2 text-xs text-secondaryText">
        <LockClosedIcon className="size-4 shrink-0 text-icons" />
        Only your admin can change these details. If something is wrong, let
        them know.
      </p>
    </section>
  );
}

export default AccountInfoCard;
