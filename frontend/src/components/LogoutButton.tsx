import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth/useLogout";

function LogoutButton() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  function handleLogout(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  }
  return (
    <div className="flex flex-col items-center justify-end  h-full w-full text-2xl  ">
      <hr className="border-borderDividers border-2  w-full" />
      <button
        onClick={handleLogout}
        className="text-secondaryText  font-semibold px-8 py-4 mt-2  text-center flex items-center justify-center gap-4 hover:cursor-pointer  hover:text-primaryText transition-colors rounded-lg hover:bg-cardBG w-full"
      >
        <ArrowLeftStartOnRectangleIcon className="size-6 shrink-0" />
        <span className="text-xl">Logout</span>
      </button>
    </div>
  );
}

export default LogoutButton;
