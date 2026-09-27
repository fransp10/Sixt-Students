import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import AdminStudentSearchResults from "./AdminStudentSearchResults";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useStudentsCtx } from "../../hooks/auth/useStudentsContext";
import { useGetAllUsers } from "../../hooks/useGetAllUsers";

function AdminStudentSearchModal() {
  const { closeStudentSearch } = useStudentsCtx();
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: students, isLoading } = useGetAllUsers("student");
  const [filterValue, setFilterValue] = useState("");
  const filteredStudents = students?.filter((student) =>
    [student?.first_name, student?.last_name]
      .map((value) => String(value ?? "").toLowerCase())
      .some((value) => value.includes(filterValue)),
  );

  useEffect(() => {
    searchRef.current?.focus();
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // Close the modal
        closeStudentSearch();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeStudentSearch]);

  if (isLoading) {
    return createPortal(<div>Loading..</div>, document.body);
  }

  return createPortal(
    <div
      onClick={closeStudentSearch}
      className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-md bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col overflow-hidden bg-cardBG md:h-[70vh] md:max-h-162.5 md:w-125 md:rounded-xl md:border md:border-borderDividers relative"
      >
        <form className="bg-cardBG p-4 flex flex-row shrink-0 relative ">
          <button className="right-0 top-1/2 -translate-y-1/2 -translate-x-full absolute size-6 text-secondaryText cursor-pointer ">
            <MagnifyingGlassIcon />
          </button>
          <input
            onChange={(e) => setFilterValue(e.target.value.toLowerCase())}
            ref={searchRef}
            className="focus:outline-none focus:border focus:border-primary rounded-lg w-full p-4 border border-borderDividers  text-primaryText"
            placeholder="Search students..."
          />
        </form>
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain   scrollbar-thin
  scrollbar-thumb-borderDividers
  scrollbar-track-cardBG"
        >
          <AdminStudentSearchResults
            isLoading={isLoading}
            students={filteredStudents}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default AdminStudentSearchModal;
