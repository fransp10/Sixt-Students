import type { UserMeType } from "./user";

export type AuthContextType = {
  currentUser: UserMeType | null;
  isLoading: boolean;
};
