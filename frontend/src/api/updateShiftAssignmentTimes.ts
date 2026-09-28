import { axiosClient } from "./axios";

export async function updateShiftAssignmentTimes(vars: {
  shiftId: number;
  userId: number;
  arrivedAt: string;
  leftAt: string;
  no_show: boolean;
}) {
  const { shiftId, ...body } = vars;
  const response = await axiosClient.patch(
    `/shifts/${shiftId}/assignments`,
    body,
  );
  return response.data;
}
