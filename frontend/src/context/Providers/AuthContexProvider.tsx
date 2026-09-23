import type { ReactNode } from "react";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import type { UserMeType } from "../../types/user";
import { AuthContext } from "../AuthContext";

type AuthContextProviderProps = { children: ReactNode };
export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { data: user, isLoading } = useCurrentUser();
  let currentUser: UserMeType | null = null;
  if (!isLoading) {
    currentUser = user ?? null;
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
