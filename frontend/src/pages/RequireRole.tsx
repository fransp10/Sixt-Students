import { Navigate, Outlet } from "react-router-dom";
import type { UserRoles } from "../types/user";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import FullPageSpinner from "./FullPageSpinner";

function RequireRole({ requiredRole }: { requiredRole: UserRoles }) {
  const { currentUser, isLoading } = useAuthContext();
  console.log(currentUser?.user_role !== requiredRole);
  console.dir(currentUser);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (currentUser?.user_role !== requiredRole && !isLoading) {
    return <Navigate to={"/unauthorized"} replace />;
  }

  return <Outlet />;
}

export default RequireRole;
