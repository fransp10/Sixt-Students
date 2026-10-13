import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateUser } from "../api/usersApi";

export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["activateUser"],
    mutationFn: (userId: string) => activateUser(userId),
    onSuccess: (_data, userId) => {
      // Invalidate the queries related to users and the specific user
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", String(userId)] });
    },
  });
}
