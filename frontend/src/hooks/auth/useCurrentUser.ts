import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/authApi";

export function useCurrentUser() {
  const currentUserQury = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });
  return currentUserQury;
}
