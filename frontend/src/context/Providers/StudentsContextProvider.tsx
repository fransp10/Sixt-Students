import { useState, type ReactNode } from "react";
import { StudentsContext } from "../StudentsContext";

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
