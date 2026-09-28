import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShiftAssignmentTimes } from "../api/updateShiftAssignmentTimes";

export function useUpdateShiftAssignmentTimes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShiftAssignmentTimes,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({
        queryKey: ["getUsersShiftsWorked", String(variables.userId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["getStatsForShiftsUserHasWorked", String(variables.userId)],
      });
    },
  });
}
