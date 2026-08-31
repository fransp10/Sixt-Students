import { createContext } from "react";

export type User = {
  username: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
