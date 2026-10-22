import { axiosClient } from "./axios";
import type {
  CreatedUser,
  CreateUserReqBodyType,
  SigninOption,
  UserRoles,
} from "../types/user";
import type { UserStats } from "../types/stats";
import { format } from "date-fns";
import type { Contract, ContractsWithoutSignedUrl } from "../types/contracts";

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

export async function getMyGoal(month?: string): Promise<{ amount: number }> {
  const res = await axiosClient.get(`/me/goal?month=${month}`);

  return res.data;
}

export async function updateMyGoal(
  amount: number,
): Promise<{ amount: number }> {
  return (await axiosClient.patch("/me/goal", { amount })).data;
}

export async function getUserById(userId: string) {
  const res = await axiosClient.get(`/users/${userId}`);
  return res.data;
}

export async function sendPasswordResetEmail(userId: string, email: string) {
  const res = await axiosClient.post(`/users/${userId}/password-reset`, {
    email,
  });
  return res.data;
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await axiosClient.post(`/auth/reset-password`, {
    token,
    newPassword,
  });
  return res.data;
}

export async function checkPasswordResetToken(token: string) {
  const res = await axiosClient.post(`/auth/reset-password/validate`, {
    token,
  });
  return res.data;
}

export async function updateUserHourlyRate(userId: string, hourlyRate: number) {
  const res = await axiosClient.patch(`/users/${userId}`, {
    default_hourly_rate: hourlyRate,
  });
  return res.data;
}

export async function deactivateUser(userId: string) {
  const res = await axiosClient.patch(`/users/${userId}/deactivate`);
  return res.data;
}

export async function activateUser(userId: string) {
  const res = await axiosClient.patch(`/users/${userId}/activate`);
  return res.data;
}

export async function createUser({
  first_name,
  last_name,
  email,
  date_of_birth,
  default_hourly_rate,
  user_role,
  signin_option,
}: CreateUserReqBodyType & { signin_option: SigninOption }) {
  const res = await axiosClient.post("/users/", {
    first_name: first_name,
    last_name: last_name,
    email: email ? email : null,
    date_of_birth: date_of_birth,
    default_hourly_rate: default_hourly_rate,
    user_role: user_role,
    signin_option: signin_option,
  });
  return res.data as Promise<CreatedUser>;
}

export async function uploadContractToBackend(month: string, file: File) {
  const res = await axiosClient.post(
    `/me/contract`,
    { month, contract: file },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}

export async function getContract(month: string, download?: boolean) {
  const res = await axiosClient.get(
    `/me/contract?month=${month}&download=${download}`,
  );
  return res.data as Contract;
}

export async function getContracts() {
  const res = await axiosClient.get(`/me/contracts`);
  return res.data as ContractsWithoutSignedUrl[];
}

export async function uploadContract(month: string, file: File) {
  const res = await axiosClient.post(
    `/me/contracts`,
    { month, contract: file },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}
