import { axiosClient } from "./axios";
import type { UserRoles } from "../types/user";
import type { UserStats } from "../types/stats";
import { format } from "date-fns";

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

export async function getUsersShiftsWorked(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  if (!userId) {
    throw new Error("User ID is required to fetch shift assignments.");
  }

  let endpoint = `/users/${userId}/shift-assignments?period=past`;
  if (startDate && endDate) {
    startDate = format(new Date(startDate), "yyyy-MM-dd");
    endDate = format(new Date(endDate), "yyyy-MM-dd");
    endpoint += `&startDate=${startDate}&endDate=${endDate}`;
  }
  if (startDate && !endDate) {
    startDate = format(new Date(startDate), "yyyy-MM-dd");
    endpoint += `&startDate=${startDate}`;
  }
  if (endDate && !startDate) {
    endDate = format(new Date(endDate), "yyyy-MM-dd");
    endpoint += `&endDate=${endDate}`;
  }

  const res = await axiosClient.get(endpoint);

  return res.data;
}

export async function updateMyInfo(email?: string, phone?: string) {
  return (await axiosClient.patch("/me", { email, phone })).data;
}

export async function changeMyPassword(
  currentPassword: string,
  newPassword: string,
) {
  return await axiosClient.patch("/me/password", {
    currentPassword,
    newPassword,
  });
}

export async function getNextShiftForUser() {
  const res = await axiosClient.get("/me/assignments/next");

  return res.data;
}

export async function getRaceStats(month?: string) {
  let endpoint = `/me/race`;
  if (month) {
    month = format(new Date(month), "yyyy-MM");
  }
  if (month) {
    endpoint += `?month=${month}`;
  }

  const res = await axiosClient.get(endpoint);
  return res.data;
}

export async function getRaceMonths() {
  const res = await axiosClient.get("/me/race/months");
  return res.data;
}
