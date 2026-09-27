import { useContext } from "react";
import { StudentsContext } from "../../context/StudentsContext";

export function useStudentsCtx() {
  const ctx = useContext(StudentsContext);
  if (!ctx) {
    throw new Error("useStudentsCtx must be used within a StudentsProvider");
  }

  return ctx;
}
