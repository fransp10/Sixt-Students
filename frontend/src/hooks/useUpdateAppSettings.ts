import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppSettings } from "../api/adminApi";
import type { AppSettings } from "../types/appSettings";

export function useUpdateAppSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateAppSettings"],
    mutationFn: (updates: Partial<AppSettings>) => updateAppSettings(updates),
    onSuccess: (settings) => {
      queryClient.setQueryData(["appSettings"], settings);
    },
  });
}
