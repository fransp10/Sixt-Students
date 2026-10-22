import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDeletableStudents } from "../../hooks/useDeletableStudents";
import type { DeletableStudent } from "../../types/deletableStudent";
import { useAdminDeleteStudent } from "../../hooks/useAdminDeleteStudent";
import LoadingSpinner from "../LoadingSpinner";

type DeleteStudentModalProps = {
  handleCloseModal: () => void;
};

function DeleteStudentModal({ handleCloseModal }: DeleteStudentModalProps) {
  const { data: students, isLoading, isError } = useDeletableStudents();
  const {
    mutate: deleteStudent,
    isError: isDeleteError,
    isSuccess,
    isPending,
  } = useAdminDeleteStudent();
  const [filterValue, setFilterValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const filteredStudents = students?.filter((student) =>
    `${student.first_name} ${student.last_name} ${student.email ?? ""}`
      .toLowerCase()
      .includes(filterValue),
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseModal]);

  function handleDeleteStudent(student: DeletableStudent) {
    deleteStudent(student.id);
    setConfirmDeleteId(null);
  }

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseModal();
      }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="relative flex max-h-[80vh] w-full max-w-xl flex-col gap-4 rounded-lg border border-borderDividers bg-cardBG p-4 text-primaryText">
        <div className="pr-10">
          <h1 className="text-xl font-semibold">Delete a student</h1>
          <h2 className="text-sm text-secondaryText">
            Deleting removes the student's account for good.
          </h2>
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={handleCloseModal}
          className="absolute right-3 top-3 rounded-lg bg-cardLighterBG text-secondaryText transition-colors cursor-pointer hover:text-danger"
        >
          <XMarkIcon className="size-8 p-2" />
        </button>

        <div className="flex gap-3 rounded-lg border border-pending/30 bg-pending/10 p-3 text-sm">
          <InformationCircleIcon className="size-5 shrink-0 text-pending" />
          <p className="text-primaryText">
            You can only delete students who have no shift requests or
            assignments, so no shift or payroll history is ever lost. To remove
            a student who already has shifts, deactivate them on their profile
            instead.
          </p>
        </div>

        <label className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-secondaryText" />
          <input
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value.toLowerCase())}
            placeholder="Search by name or email"
            className="w-full rounded-lg border border-borderDividers bg-studentCard py-2 pl-9 pr-3 text-primaryText outline-none focus:border-pending"
          />
        </label>

        {isLoading && <p className="text-sm text-secondaryText">Loading...</p>}

        {isError && (
          <p className="text-sm text-secondaryText">
            Couldn't load the students who can be deleted
          </p>
        )}

        {isDeleteError && (
          <p className="text-sm text-danger">
            Couldn't delete the student, try again
          </p>
        )}

        {!isLoading && !isError && !filteredStudents?.length && (
          <p className="text-sm text-secondaryText">
            {filterValue
              ? "No students match your search"
              : "No students can be deleted right now"}
          </p>
        )}

        {!!filteredStudents?.length && (
          <ul
            className={`flex min-h-0 flex-col gap-2 overflow-y-auto pr-1 ${isPending && "pointer-events-none *:opacity-60"}`}
          >
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className="flex flex-wrap items-center gap-3 rounded-lg bg-studentCard px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="truncate text-xs text-secondaryText">
                    {student.email ?? "No email"} · added{" "}
                    {formatDistanceToNow(parseISO(student.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {confirmDeleteId === student.id && !isPending && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteStudent(student)}
                      className="min-h-9 rounded-lg bg-danger px-3 text-sm font-semibold text-white cursor-pointer hover:bg-danger/80"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="min-h-9 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-secondaryText cursor-pointer hover:text-primaryText"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {confirmDeleteId !== student.id &&
                  !isPending &&
                  !isSuccess &&
                  !isDeleteError && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(student.id)}
                      className="min-h-9 rounded-lg border border-borderDividers px-3 text-sm font-semibold text-secondaryText cursor-pointer hover:border-danger hover:text-danger"
                    >
                      Delete
                    </button>
                  )}

                {isPending && (
                  <div className="mr-4">
                    <LoadingSpinner size={24} />
                  </div>
                )}

                {isSuccess && (
                  <p className="text-sm text-success">
                    Student deleted successfully
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default DeleteStudentModal;
