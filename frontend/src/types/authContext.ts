import type { UserMeType } from "./user";

export type AuthContext = {
  currentUser: UserMeType | null;
  isLoading : boolean
};
