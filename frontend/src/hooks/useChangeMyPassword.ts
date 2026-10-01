import { useMutation } from "@tanstack/react-query";
import { changeMyPassword } from "../api/usersApi";

export function useChangeMyPassword() {
  const changeMyPasswordMutation = useMutation({
    mutationKey: ["changeMyPassword"],
    mutationFn: (vars: { currentPassword: string; newPassword: string }) =>
      changeMyPassword(vars.currentPassword, vars.newPassword),
  });

  return changeMyPasswordMutation;
}
