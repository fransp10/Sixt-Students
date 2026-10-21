import { axiosClient } from "./axios";

export async function getAdminStats() {
  const adminStats = await axiosClient.get("/admin/stats");

  return adminStats.data;
}
