import { format } from "date-fns";
import DashboardHeader from "../../components/student/Dashboard/DashboardHeader";

import AdminDashboardContent from "../../components/Admin/AdminDashboardContent";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CreateStudentModal from "../../components/student/Dashboard/CreateStudentModal";

function AdminDashboardPage() {
  const [createStudentModalOpen, setCreateStudentModalOpen] = useState(false);
  const currentDate = format(new Date(), "EEEE, MMMM do");
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="uppercase text-xl font-semibold text-secondaryText">
            {currentDate}
          </h1>
          <DashboardHeader subheading="Here's an overview of your students and shifts" />
        </div>
        <div className="flex items-center gap-4">
          <label className="relative">
            <MagnifyingGlassIcon className="size-4 text-secondaryText absolute -translate-y-1/2 top-1/2 left-4 -translate-x-1/2 " />
            <input
              placeholder="Jump to student"
              className="z-10 py-2 pl-8 px-4 rounded-lg bg-studentCard outline-none border border-borderDividers text-primaryText focus:border-pending"
            />
          </label>
          <button
            onClick={() => setCreateStudentModalOpen(true)}
            className=" text-nowrap py-2 px-4 rounded-lg bg-primary text-white flex items-center gap-2 cursor-pointer hover:bg-primary/80"
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
    </div>
  );
}

export default AdminDashboardPage;
