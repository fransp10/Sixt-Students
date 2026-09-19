import { useMutation } from "@tanstack/react-query";
import { logout } from "../../api/authApi";

export function useLogout() {
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
  });
  return logoutMutation;
}
