import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser";

function DashboardHeader({
  subheading = "Here's an overview of your activities",
}: {
  subheading?: string;
}) {
  const currentTime = new Date().getHours();
  const { data: user } = useCurrentUser();

  if (!user) {
    return <Navigate to={`/login`} />;
  }

  let greeting;

  if (currentTime < 10 && currentTime >= 5) {
    greeting = "Good morning";
  }
  if (currentTime >= 10 && currentTime < 18) {
    greeting = "Good afternoon";
  }
  if (currentTime >= 18 || currentTime < 5) {
    greeting = "Good evening";
  }

  return (
    <div className="text-primaryText mb-4">
      <h1 className="text-2xl md:text-3xl font-semibold ">
        {greeting}, {user.first_name}!
      </h1>
      <p className="text-base md:text-xl text-secondaryText font-semibold">
        {subheading}
      </p>
    </div>
  );
}

export default DashboardHeader;
