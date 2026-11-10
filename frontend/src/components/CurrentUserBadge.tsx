import { getAvatarColor, getInitials } from "../helpers/helpers";
import { useAuthContext } from "../hooks/auth/useAuthContext";

function CurrentUserBadge() {
  const { currentUser } = useAuthContext();

  if (!currentUser) return null;

  const fullName = currentUser.first_name + " " + currentUser.last_name;
  return (
    <div className="mt-2 flex items-center gap-3 rounded-xl border border-borderDividers bg-cardBG p-3">
      <span
        className={`${getAvatarColor(currentUser.id)} size-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold text-white`}
      >
        {getInitials(fullName)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-primaryText">{fullName}</p>
        <p className="text-sm capitalize text-secondaryText">
          {currentUser.user_role}
        </p>
      </div>
    </div>
  );
}

export default CurrentUserBadge;
