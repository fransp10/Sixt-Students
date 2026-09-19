import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/authApi";

export function useLogin() {
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: (userInfo: { username: string; password: string }) =>
      login(userInfo.username, userInfo.password),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });
  return loginMutation;
}
