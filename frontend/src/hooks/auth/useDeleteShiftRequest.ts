import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteShiftRequest } from "../../api/shiftsApi";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import type { UserMeType } from "../../types/user";

export function useDeleteShiftRequest() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserMeType>(["currentUser"]);
  const deleteShiftRequestMutation = useMutation({
    mutationKey: ["deleteShiftRequest"],
    mutationFn: (vars: {
      shiftId: number;
      startDate: string;
      endDate: string;
    }) => deleteShiftRequest(vars.shiftId),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["shifts", variables.startDate, variables.endDate],
        (oldData: ShiftWithStudentsAndRequesters[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map((s) => {
            if (s.shift_id === variables.shiftId) {
              return {
                ...s,
                students_requesting: s.students_requesting.filter(
                  (student) => student.id !== currentUser?.id,
                ),
              };
            } else return s;
          });
        },
      );
    },
    onError: (error) => {
      console.error("Error deleting shift request:", error);
    },
  });
  return deleteShiftRequestMutation;
}
