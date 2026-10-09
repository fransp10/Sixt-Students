import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyGoal } from "../api/usersApi";

export function useUpdateMyGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateMyGoal"],
    mutationFn: (amount: number) => updateMyGoal(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGoal"] });
    },
  });
}
