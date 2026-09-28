import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unassignStudentFromShift } from "../../api/shiftsApi";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import type { StudentAssigned } from "../../types/students";

export function useUnAssignStudentFromShift() {
  const queryClient = useQueryClient();
  const unAssignStudentFromShift = useMutation({
    mutationKey: ["unAssignStudentFromShift"],
    mutationFn: (vars: {
      shiftId: number;
      userId: number;
      startDate: string;
      endDate: string;
    }) => unassignStudentFromShift(vars.shiftId, vars.userId),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["shifts", variables.startDate, variables.endDate],
        (oldData: ShiftWithStudentsAndRequesters[]) => {
          if (!oldData) return oldData;
          return oldData.map((s) => {
            if (s.shift_id !== variables.shiftId) {
              return s;
            }
            const studentToUnAssign = s.students_assigned.find(
              (student: StudentAssigned) => student.id === variables.userId,
            );
            if (!studentToUnAssign) {
              return s;
            }

            return {
              ...s,
              students_assigned: s.students_assigned.filter(
                (student) => student.id !== variables.userId,
              ),
              students_requesting: [
                ...s.students_requesting,
                studentToUnAssign,
              ].sort(
                (a, b) =>
                  a.requested_at.localeCompare(b.requested_at) || a.id - b.id,
              ),
            };
          });
        },
      );
    },
  });
  return unAssignStudentFromShift;
}
