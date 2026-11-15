import { useQuery } from "@tanstack/react-query";
import { getAppSettings } from "../api/adminApi";

export function useGetAppSettings() {
  return useQuery({
    queryKey: ["appSettings"],
    queryFn: getAppSettings,
  });
}
