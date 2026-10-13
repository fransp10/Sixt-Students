import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserHourlyRate } from "../api/usersApi";

export function useUpdateUserHourlyRate() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["updateUserHourlyRate"],
    mutationFn: (vars: { userId: string; hourlyRate: number }) =>
      updateUserHourlyRate(vars.userId, vars.hourlyRate),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["user", String(vars.userId)],
      });
    },
  });

  return mutation;
}
