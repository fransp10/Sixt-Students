import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import FullPageSpinner from "./FullPageSpinner";
function IndexPageRouter() {
  const { currentUser, isLoading } = useAuthContext();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.user_role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }
  if (currentUser.user_role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/login" replace />;
}

export default IndexPageRouter;
