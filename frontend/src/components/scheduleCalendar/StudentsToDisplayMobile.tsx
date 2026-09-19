import { getInitials } from "../../helpers/helpers";

function StudentsToDisplayMobile() {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex gap-2 items-center">
        <div className="p-2 text-xs bg-surfaceCards rounded-full">
          <span>{getInitials("Student name")}</span>
        </div>
        <span>Student Name</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="p-2 text-xs bg-surfaceCards rounded-full">
          <span>{getInitials("Student name")}</span>
        </div>
        <span>Student Name</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="p-2 text-xs bg-surfaceCards rounded-full">
          <span>{getInitials("Student name")}</span>
        </div>
        <span>Student Name</span>
      </div>
    </div>
  );
}

export default StudentsToDisplayMobile;
