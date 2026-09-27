import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestShift } from "../../api/shiftsApi";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import type { UserMeType } from "../../types/user";

export function useRequestShift() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserMeType>(["currentUser"]);
  const requestShiftMutation = useMutation({
    mutationKey: ["requestShift"],
    mutationFn: (vars: {
      shiftId: number;
      startDate: string;
      endDate: string;
    }) => requestShift(vars.shiftId),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["shifts", variables.startDate, variables.endDate],
        (oldData: ShiftWithStudentsAndRequesters[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((s) => {
            if (s.shift_id === variables.shiftId) {
              return {
                ...s,
                students_requesting: [
                  ...s.students_requesting,
                  {
                    id: currentUser?.id,
                    first_name: currentUser?.first_name,
                    last_name: currentUser?.last_name,
                    requested_at: new Date().toISOString(),
                    username: currentUser?.username,
                  },
                ],
              };
            } else {
              return s;
            }
          });
        },
      );
    },
    onError: (error) => {
      console.error("Error requesting shift:", error);
    },
  });

  return requestShiftMutation;
}
