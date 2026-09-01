import { createContext, useContext, useState, type ReactNode } from "react";
import type { Student } from "../types/students";

type StudentsContextType = {
  selectedStudent: Student | null;
  isSearchOpen: boolean;

  selectStudent: (student: Student) => void;
  openStudentSearch: () => void;
  closeStudentSearch: () => void;
};

const StudentsContext = createContext<StudentsContextType | null>(null);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function selectStudent(student: Student) {
    setSelectedStudent(student);
    setIsSearchOpen(false);
  }

  function openStudentSearch() {
    setIsSearchOpen(true);
  }

  function closeStudentSearch() {
    setIsSearchOpen(false);
  }

  return (
    <StudentsContext.Provider
      value={{
        selectedStudent,
        isSearchOpen,
        selectStudent,
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
