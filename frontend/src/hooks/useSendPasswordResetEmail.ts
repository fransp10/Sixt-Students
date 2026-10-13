import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetEmail } from "../api/usersApi";

export function useSendPasswordResetEmail() {
  const mutation = useMutation({
    mutationKey: ["sendPasswordResetEmail"],
    mutationFn: (vars: { userId: string; email: string }) =>
      sendPasswordResetEmail(vars.userId, vars.email),
  });

  return mutation;
}
