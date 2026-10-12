import { Link } from "react-router-dom";
import type { UserRoles } from "../../types/user";

function ErrorLink({ currentUserRole }: { currentUserRole?: UserRoles }) {
  return (
    <Link
      className=" text-secondaryText text-sm  font-semibold sm:text-xl p-4 bg-cardBG rounded-xl hover:bg-cardLighterBG
        hover:text-primaryText text-center cursor-pointer transition-colors duration-200"
      to={currentUserRole ? `/${currentUserRole}` : `/login`}
    >
      Go back to the {currentUserRole ? `${currentUserRole}'s` : "login"} page
    </Link>
  );
}

export default ErrorLink;
