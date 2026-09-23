import { useAuthContext } from "../../hooks/auth/useAuthContext";
import NotFoundPageContent from "./NotFoundPageContent";

function NotFoundPage() {
  const { currentUser } = useAuthContext();

  if (currentUser) {
    const currentUserRole = currentUser?.user_role;
    return <NotFoundPageContent currentUserRole={currentUserRole} />;
  }

  return <NotFoundPageContent />;
}

export default NotFoundPage;
