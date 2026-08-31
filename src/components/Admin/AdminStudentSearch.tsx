import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import AdminStudentSearchResults from "./AdminStudentSearchResults";

function AdminStudentSearch() {
  return (
    <div className=" w-1/4 h-full bg-cardBG border rounded-lg border-borderDividers  ">
      <form className="bg-cardBG p-4 flex flex-row  relative ">
        <button className="right-0 top-1/2 -translate-y-1/2 -translate-x-full absolute size-6 text-secondaryText cursor-pointer ">
          <MagnifyingGlassIcon />
        </button>
        <input
          className="focus:outline-none focus:border focus:border-primary rounded-lg w-full p-4 border border-borderDividers  text-primaryText"
          placeholder="Search students..."
        />
        <button></button>
      </form>
      <AdminStudentSearchResults />
    </div>
  );
}

export default AdminStudentSearch;
