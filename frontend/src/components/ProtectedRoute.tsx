import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/auth/useCurrentUser";
import FullPageSpinner from "../pages/FullPageSpinner";

function ProtectedRoute() {
  const { data: user, isLoading, isError } = useCurrentUser();
  if (isLoading) {
    return <FullPageSpinner />;
  }
  if (!user || isError) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
