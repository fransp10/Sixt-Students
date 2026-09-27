import { useAuthContext } from "../../hooks/auth/useAuthContext";
import FullPageSpinner from "../FullPageSpinner";
import ErrorLink from "./ErrorLink";
import sixtStudentsLogo from "../../assets/sixtStudentsLogo.png";
function Unauthorized() {
  const { currentUser, isLoading } = useAuthContext();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-pageBackground pt-32 items-center p-8">
      <img src={sixtStudentsLogo} className="h-26 xs:h-42 sm:h-48" />
      <div className="flex flex-col gap-4 sm:gap-8 items-center ">
        <h2 className="text-danger text-center font-semibold text-lg xs:text-2xl sm:text-3xl">
          You are not authorized to visit this route
        </h2>
        <ErrorLink currentUserRole={currentUser?.user_role} />
      </div>
    </div>
  );
}

export default Unauthorized;
