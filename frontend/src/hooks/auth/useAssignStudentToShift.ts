import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignStudentToShift } from "../../api/shiftsApi";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import type {
  StudentAssigned,
  StudentRequesting,
} from "../../types/students";

export function useAssignStudentToShift() {
  const queryClient = useQueryClient();

  const assignmentMutation = useMutation({
    mutationKey: ["assignStudentToShift"],
    mutationFn: (vars: {
      shiftId: number;
      userId: number;
      startDate: string;
      endDate: string;
      // only needed for students who didn't request the shift, since they aren't in students_requesting
      student?: Omit<StudentRequesting, "requested_at">;
    }) => assignStudentToShift(vars.shiftId, vars.userId),
    onSuccess: (newAssignment, variables) => {
      queryClient.setQueryData(
        ["shifts", variables.startDate, variables.endDate],
        (oldData: ShiftWithStudentsAndRequesters[]) => {
          if (!oldData) return oldData;

          return oldData.map((s) => {
            if (s.shift_id !== variables.shiftId) {
              return s; //without this every other shift becomes undefined. also we automatically filter out the shift that aren't the shift in the modal
            }
            // find the student to assign inside of the students who are requesting the shift,
            // otherwise fall back to the student passed in (assigned without a request)
            const requester = s.students_requesting.find(
              (student) => student.id === variables.userId,
            );
            const studentToAssign: StudentRequesting | undefined =
              requester ??
              (variables.student && {
                ...variables.student,
                requested_at: newAssignment.requested_at,
              });
            if (!studentToAssign) {
              return s;
            }
            const assignedStudent: StudentAssigned = {
              ...studentToAssign,
              actual_start_time: newAssignment.actual_start_time,
              actual_end_time: newAssignment.actual_end_time,
              no_show: false,
              has_request: requester !== undefined,
            };
            // return a new shift object with the student added to the students_assigned array and removed from the students_requesting array
            return {
              ...s,
              students_assigned: [assignedStudent, ...s.students_assigned].sort(
                (a, b) =>
                  a.requested_at.localeCompare(b.requested_at) || a.id - b.id,
              ),
              students_requesting: s.students_requesting.filter(
                (student) => student.id !== assignedStudent.id,
              ),
            };
          });
        },
      );
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shifts", variables.startDate, variables.endDate],
      });
    },
  });
  return assignmentMutation;
}
