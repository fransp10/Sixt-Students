import { format } from "date-fns";
import DashboardHeader from "../../components/student/Dashboard/DashboardHeader";

import AdminDashboardContent from "../../components/Admin/AdminDashboardContent";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import CreateStudentModal from "../../components/student/Dashboard/CreateStudentModal";
import AdminStudentSearchModal from "../../components/Admin/AdminStudentSearchModal";
import DeleteStudentModal from "../../components/Admin/DeleteStudentModal";
import { useStudentsCtx } from "../../hooks/auth/useStudentsContext";
import { useGetAppSettings } from "../../hooks/useGetAppSettings";

function AdminDashboardPage() {
  // loads the settings ahead of time so the add-student form opens with the default rate filled in
  useGetAppSettings();
  const [createStudentModalOpen, setCreateStudentModalOpen] = useState(false);
  const [deleteStudentModalOpen, setDeleteStudentModalOpen] = useState(false);
  const { isSearchOpen, openStudentSearch } = useStudentsCtx();
  const currentDate = format(new Date(), "EEEE, MMMM do");

  useEffect(() => {
    function handleKeysDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openStudentSearch();
      }
    }

    window.addEventListener("keydown", handleKeysDown);

    return () => {
      window.removeEventListener("keydown", handleKeysDown);
    };
  }, [openStudentSearch]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="uppercase text-xl font-semibold text-secondaryText">
            {currentDate}
          </h1>
          <DashboardHeader subheading="Here's an overview of your students and shifts" />
        </div>
        <div className="flex flex-col sm:flex-row flex-1 items-center gap-2 sm:gap-4 lg:justify-end">
          {/* Jump to student input */}
          <button
            onClick={openStudentSearch}
            className="relative flex sm:w-auto w-full"
          >
            <div className="py-2 pl-8 w-full px-4 rounded-lg bg-studentCard outline-none border border-borderDividers  text-secondaryText cursor-pointer hover:bg-studentCard/80 flex items-center gap-2 sm:w-auto">
              <MagnifyingGlassIcon className="size-4 text-secondaryText absolute -translate-y-1/2 top-1/2 left-4 -translate-x-1/2 " />
              <p className="">Jump to student</p>

              <kbd className="bg-cardBG text-secondaryText px-2 py-1 rounded-lg ml-2">
                CTRL + K
              </kbd>
            </div>
          </button>
          {/* delete student button */}
          <button
            onClick={() => setDeleteStudentModalOpen(true)}
            className="text-nowrap sm:py-2 px-4 rounded-lg border border-borderDividers bg-studentCard text-primaryText flex items-center gap-2 cursor-pointer hover:border-danger hover:text-danger w-full sm:w-auto py-4"
          >
            <TrashIcon className="size-4" />
            <span>Delete students</span>
          </button>
          {/* add new student button */}
          <button
            onClick={() => setCreateStudentModalOpen(true)}
            className=" text-nowrap sm:py-2 px-4 rounded-lg bg-primary text-white flex items-center gap-2 cursor-pointer hover:bg-primary/80 w-full sm:w-auto py-4"
          >
            <PlusIcon className="size-4" />
            <span>New student</span>
          </button>
        </div>
      </div>
      <AdminDashboardContent />
      {createStudentModalOpen && (
        <CreateStudentModal
          handleCloseModal={() => setCreateStudentModalOpen(false)}
        />
      )}

      {deleteStudentModalOpen && (
        <DeleteStudentModal
          handleCloseModal={() => setDeleteStudentModalOpen(false)}
        />
      )}

      {isSearchOpen && <AdminStudentSearchModal />}
    </div>
  );
}

export default AdminDashboardPage;
