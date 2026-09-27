import { createContext } from "react";

type StudentsContextType = {
  isSearchOpen: boolean;

  openStudentSearch: () => void;
  closeStudentSearch: () => void;
};

export const StudentsContext = createContext<StudentsContextType | null>(null);
