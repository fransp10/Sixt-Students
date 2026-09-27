import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/authApi";
import type { UserMeType } from "../../types/user";

type useLoginDataType = {
  message: string;
  user: UserMeType;
};
export function useLogin() {
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: (userInfo: { username: string; password: string }) =>
      login(userInfo.username, userInfo.password),
    onSuccess: (data: useLoginDataType) => {
      queryClient.setQueryData(["currentUser"], data?.user);
    },
  });
  return loginMutation;
}
