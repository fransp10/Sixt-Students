import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function ProtectedRoute() {
  const { user } = useAuth();

  if (user === null) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
