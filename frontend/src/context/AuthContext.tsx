import { createContext } from "react";
import type { AuthContext as AuthContextType } from "../types/authContext";

export const AuthContext = createContext<AuthContextType | null>(null);
