import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShiftAssignmentTimes } from "../api/updateShiftAssignmentTimes";
import type { ShiftWithStudentsAndRequesters } from "../types/Shift";

export function useUpdateShiftAssignmentTimes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShiftAssignmentTimes,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUsersShiftsWorked", String(variables.userId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["getStatsForShiftsUserHasWorked", String(variables.userId)],
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["shifts"] });
      // the variables don't include the week, so match every cached ["shifts", start, end] by prefix
      const previous = queryClient.getQueriesData<
        ShiftWithStudentsAndRequesters[]
      >({ queryKey: ["shifts"] });

      queryClient.setQueriesData<ShiftWithStudentsAndRequesters[]>(
        { queryKey: ["shifts"] },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((shift) => {
            if (shift.shift_id === variables.shiftId) {
              const studentsAssigned = shift.students_assigned
                .map((student) =>
                  student.id === variables.userId
                    ? {
                        ...student,
                        no_show: variables.no_show,
                        actual_start_time: variables.no_show
                          ? null
                          : variables.arrivedAt,
                        actual_end_time: variables.no_show
                          ? null
                          : variables.leftAt,
                      }
                    : student,
                )
                .sort((a, b) => {
                  return (
                    Number(a.no_show) - Number(b.no_show) ||
                    a.requested_at.localeCompare(b.requested_at) ||
                    a.id - b.id
                  );
                });
              return {
                ...shift,
                students_assigned: studentsAssigned,
              };
            }
            return shift;
          });
        },
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}
