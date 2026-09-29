import { useState } from "react";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useGetAllUsers } from "../../../hooks/useGetAllUsers";
import type { UserMeType } from "../../../types/user";
import AssignOtherStudentsCard from "./AssignOtherStudentsCard";

type AssignOtherStudentPanelProps = {
  assignedIds: number[];
  requestingIds: number[];
  pendingUserId?: number;
  onAssign: (student: UserMeType) => void;
  onClose: () => void;
};

function AssignOtherStudentPanel({
  assignedIds,
  requestingIds,
  pendingUserId,
  onAssign,
  onClose,
}: AssignOtherStudentPanelProps) {
  const [search, setSearch] = useState("");
  // students assigned from this panel stay in the list with an "Assigned" state
  const [assignedHere, setAssignedHere] = useState<number[]>([]);
  const { data: students, isLoading, isError } = useGetAllUsers("student");

  const available = (students ?? [])
    .filter(
      (student) =>
        student.is_active &&
        !requestingIds.includes(student.id) &&
        (!assignedIds.includes(student.id) ||
          assignedHere.includes(student.id)),
    )
    .sort(
      (a, b) =>
        a.first_name.localeCompare(b.first_name) ||
        a.last_name.localeCompare(b.last_name),
    );

  const query = search.trim().toLowerCase();
  const matches = available.filter((student) =>
    `${student.first_name} ${student.last_name} ${student.username}`
      .toLowerCase()
      .includes(query),
  );

  const handleAssign = (student: UserMeType) => {
    setAssignedHere((prev) => [...prev, student.id]);
    onAssign(student);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-borderDividers bg-cardBG p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <UserPlusIcon className="size-6 text-primary" />
        <span className="font-bold">Assign other students</span>
        {!isLoading && !isError && (
          <span className="text-sm text-secondaryText">
            {matches.length} available
          </span>
        )}
        <button
          onClick={onClose}
          className="ml-auto cursor-pointer rounded-lg border border-borderDividers p-2 transition-colors hover:bg-surfaceCards"
        >
          <XMarkIcon className="size-5 text-primaryText" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-secondaryText" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or username"
          className="h-11 w-full rounded-xl border border-borderDividers bg-cardBG pl-10 pr-3 text-sm text-primaryText placeholder:text-secondaryText focus:border-primary focus:outline-none"
        />
      </div>

      {/* Students */}
      <div className="scrollbar-thin scrollbar-thumb-surfaceCards p-4 flex max-h-80 flex-col gap-2 overflow-y-auto">
        {isLoading ? (
          <p className="p-4 text-center text-sm text-secondaryText">
            Loading students…
          </p>
        ) : isError ? (
          <p className="p-4 text-center text-sm text-danger">
            Couldn't load students. Close and try again.
          </p>
        ) : available.length === 0 ? (
          <p className="rounded-xl border border-dashed border-borderDividers p-4 text-center text-sm text-secondaryText">
            Every active student is already on this shift.
          </p>
        ) : matches.length === 0 ? (
          <p className="rounded-xl border border-dashed border-borderDividers p-4 text-center text-sm text-secondaryText">
            No students match "{search.trim()}".
          </p>
        ) : (
          matches.map((student) => {
            const isAssigned = assignedIds.includes(student.id);
            const isPending = pendingUserId === student.id;

            return (
              <AssignOtherStudentsCard
                student={student}
                isAssigned={isAssigned}
                isPending={isPending}
                handleAssign={handleAssign}
                key={student.id}
              />
            );
          })
        )}
      </div>

      <span className="text-xs text-secondaryText">
        Students already assigned to or requesting this shift aren't listed.
      </span>
    </div>
  );
}

export default AssignOtherStudentPanel;
