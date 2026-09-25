import { axiosClient } from "./axios";
import type { UserRoles } from "../types/user";
import type { UserStats } from "../types/Shift";

export async function getUsers(role?: UserRoles) {
  if (role) {
    const response = await axiosClient.get(`/users?role=${role}`);
    return response.data;
  }

  const response = await axiosClient.get("/users");
  return response.data;
}

export async function getStatsForShiftsUserHasWorked(
  userId: string,
  startDate?: string,
  endDate?: string,
): Promise<UserStats> {
  if (!userId) {
    throw new Error("User ID is required to fetch shifts worked.");
  }
  let endpoint = `/users/${userId}/stats`;

  if (startDate && endDate) {
    endpoint += `?startDate=${startDate}&endDate=${endDate}`;
  }
  if (startDate && !endDate) {
    endpoint += `?startDate=${startDate}`;
  }
  if (endDate && !startDate) {
    endpoint += `?endDate=${endDate}`;
  }

  const response = await axiosClient.get(endpoint);

  return response.data;
}
