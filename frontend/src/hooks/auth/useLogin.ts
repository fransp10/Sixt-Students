import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/authApi";
import type { UserMeType } from "../../types/user";
import { useNavigate } from "react-router-dom";

type useLoginDataType = {
  message: string;
  user: UserMeType;
};
export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: (userInfo: { username: string; password: string }) =>
      login(userInfo.username, userInfo.password),
    onSuccess: (data: useLoginDataType) => {
      queryClient.setQueryData(["currentUser"], data?.user);
      navigate(data.user?.user_role === "admin" ? "/admin" : "/student");
    },
  });
  return loginMutation;
}
