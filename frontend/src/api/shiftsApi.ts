import type { ShiftWithStudentsAndRequesters } from "../types/Shift";
import { axiosClient } from "./axios";

export async function getShifts(
  startDate?: string,
  endDate?: string,
): Promise<ShiftWithStudentsAndRequesters[]> {
  const response = await axiosClient.get("/shifts", {
    params: {
      startDate,
      endDate,
    },
  });
  return response.data as ShiftWithStudentsAndRequesters[];
}

// export async function getStudentsRequestingShift(
//   shiftId: number,
// ): Promise<StudentsRequestingShift> {
//   const response = await axiosClient.get(`/shifts/${shiftId}/requests`);

//   return response.data as StudentsRequestingShift;
// }

export async function requestShift(shiftId: number) {
  const createdRequest = await axiosClient.post(`/shifts/${shiftId}/requests`);
  return createdRequest.data;
}

export async function deleteShiftRequest(shiftId: number) {
  const deletedRequest = await axiosClient.delete(
    `/shifts/${shiftId}/requests`,
  );
  return deletedRequest.data;
}

export async function assignStudentToShift(shiftId: number, userId: number) {
  const studentAssignment = await axiosClient.post(
    `/shifts/${shiftId}/assignments`,
    {
      userId: userId,
    },
  );
  return studentAssignment.data;
}

export async function unassignStudentFromShift(
  shiftId: number,
  userId: number,
) {
  const studentUnassignment = await axiosClient.delete(
    `/shifts/${shiftId}/assignments`,
    {
      data: {
        userId: userId,
      },
    },
  );
  return studentUnassignment.data;
}
