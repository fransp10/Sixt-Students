import type { UserMeType } from "../types/user";
import { axiosClient } from "./axios";

export async function login(username: string, password: string) {
  const response = await axiosClient.post("/auth/login", {
    username,
    password,
  });

  return response.data;
}

export async function logout() {
  const response = await axiosClient.post("/auth/logout");
  return response.data;
}

export async function getCurrentUser(): Promise<UserMeType> {
  const response = await axiosClient.get("/me");
  console.log(response);
  return response.data.user;
}
