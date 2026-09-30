import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyInfo } from "../api/usersApi";

export function useUpdateMyInfo() {
  const queryClient = useQueryClient();
  const updatedInfo = useMutation({
    mutationKey: ["updateMyInfo"],
    mutationFn: (vars: { email?: string; phone?: string }) =>
      updateMyInfo(vars.email, vars.phone),
    onSuccess: () => {
      console.log("User info updated successfully");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Error updating user info:", error);
      console.log(error.name);
    },
  });
  return updatedInfo;
}
