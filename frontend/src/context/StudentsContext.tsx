import { createContext, useContext, useState, type ReactNode } from "react";

type StudentsContextType = {
  isSearchOpen: boolean;

  openStudentSearch: () => void;
  closeStudentSearch: () => void;
};

const StudentsContext = createContext<StudentsContextType | null>(null);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function openStudentSearch() {
    setIsSearchOpen(true);
  }

  function closeStudentSearch() {
    setIsSearchOpen(false);
  }

  return (
    <StudentsContext.Provider
      value={{
        isSearchOpen,
        openStudentSearch,
        closeStudentSearch,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudentsCtx() {
  const ctx = useContext(StudentsContext);
  if (!ctx) {
    throw new Error("useStudentsCtx must be used within a StudentsProvider");
  }

  return ctx;
}
