import { useMutation, useQuery } from "@tanstack/react-query";
import { checkPasswordResetToken, resetPassword } from "../api/usersApi";

export function useResetPassword() {
  const resetPasswordMutation = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: (vars: { token: string; newPassword: string }) =>
      resetPassword(vars.token, vars.newPassword),
  });

  return resetPasswordMutation;
}

export function useValidateResetToken(token: string) {
  const validateResetToken = useQuery({
    queryKey: ["validateResetToken", token],
    queryFn: () => checkPasswordResetToken(token),
    enabled: Boolean(token),
    retry: false,
    // A refetch after a successful reset would report the now-used token as invalid
    refetchOnWindowFocus: false,
  });

  return validateResetToken;
}
