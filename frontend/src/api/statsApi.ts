import { axiosClient } from "./axios";

export async function getMyStats() {
  const response = await axiosClient.get(`me/stats`);

  return response.data;
}
