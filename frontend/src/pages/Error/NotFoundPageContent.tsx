import type { UserRoles } from "../../types/user";
import ErrorLink from "./ErrorLink";
import sixtStudentsLogo from "../../assets/sixtStudentsLogo.png";
function NotFoundPageContent({
  currentUserRole,
}: {
  currentUserRole?: UserRoles;
}) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-2 sm:gap-4 bg-pageBackground">
      <img src={sixtStudentsLogo} className="h-26 xs:h-42 sm:h-48" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 font-semibold text-lg xs:text-2xl sm:text-3xl">
          <h1 className="text-primary">404</h1>
          <h1 className="text-primaryText">Page not found</h1>
        </div>
        <ErrorLink currentUserRole={currentUserRole} />
      </div>
    </div>
  );
}

export default NotFoundPageContent;
