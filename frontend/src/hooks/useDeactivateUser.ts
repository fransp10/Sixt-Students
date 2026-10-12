import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateUser } from "../api/usersApi";

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deactivateUser"],
    mutationFn: (userId: string) => deactivateUser(userId),
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", String(userId)] });
    },
  });
}
