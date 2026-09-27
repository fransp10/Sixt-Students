import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignStudentToShift } from "../../api/shiftsApi";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";

export function useAssignStudentToShift() {
  const queryClient = useQueryClient();

  const assignmentMutation = useMutation({
    mutationKey: ["assignStudentToShift"],
    mutationFn: (vars: {
      shiftId: number;
      userId: number;
      startDate: string;
      endDate: string;
    }) => assignStudentToShift(vars.shiftId, vars.userId),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["shifts", variables.startDate, variables.endDate],
        (oldData: ShiftWithStudentsAndRequesters[]) => {
          if (!oldData) return oldData;

          return oldData.map((s) => {
            if (s.shift_id !== variables.shiftId) {
              return s; //without this every other shift becomes undefined. also we automatically filter out the shift that aren't the shift in the modal
            }
            // find the student to assign inside of the students who are requesting the shift
            const studentToAssign = s.students_requesting.find(
              (student) => student.id === variables.userId,
            );
            if (!studentToAssign) {
              return s;
            }
            // return a new shift object with the student added to the students_assigned array and removed from the students_requesting array
            return {
              ...s,
              students_assigned: [...s.students_assigned, studentToAssign],
              students_requesting: s.students_requesting.filter(
                (student) => student.id !== variables.userId,
              ),
            };
          });
        },
      );
    },
  });
  return assignmentMutation;
}
