import { getAvatarColor, getInitials } from "../helpers/helpers";
import { useAuthContext } from "../hooks/auth/useAuthContext";

function CurrentUserBadge({ size = "large" }: { size?: "small" | "large" }) {
  const { currentUser } = useAuthContext();

  if (!currentUser) return null;

  const fullName = currentUser.first_name + " " + currentUser.last_name;
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-borderDividers bg-cardBG  ${size === "small" ? "p-1 px-4" : "p-3"}`}
    >
      <span
        className={`${getAvatarColor(currentUser.id)} ${size === "small" ? "size-8 text-xs" : "size-12 text-sm"} shrink-0 rounded-full flex items-center justify-center  font-semibold text-white`}
      >
        {getInitials(fullName)}
      </span>
      <div
        className={`min-w-0 flex ${size === "small" ? "text-xs flex-row gap-2" : "text-sm flex-col"}   gap-0.5`}
      >
        <p
          className={`${size === "small" ? "text-xs" : "text-sm"} truncate font-semibold text-primaryText`}
        >
          {fullName}
        </p>
        <p
          className={`${size === "small" ? "text-xs" : "text-sm"} capitalize text-secondaryText`}
        >
          {currentUser.user_role}
        </p>
      </div>
    </div>
  );
}

export default CurrentUserBadge;
