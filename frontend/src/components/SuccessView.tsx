import { CheckCircleIcon } from "@heroicons/react/24/outline";
import type { PropsWithChildren } from "react";

function SuccessView({
  handleCloseModal,
  heading,
  message,
  children,
}: {
  handleCloseModal: () => void;
  heading: string;
  message: string;
} & PropsWithChildren) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-center text-center gap-4 py-10 px-6  w-full max-w-md rounded-lg justify-center  bg-cardBG border border-borderDividers text-primaryText p-4"
    >
      <div className="bg-success/10 p-3 rounded-full">
        <CheckCircleIcon className="size-10 text-success" />
      </div>
      <div>
        <p className="text-lg font-semibold text-primaryText">{heading}</p>
        <p className="text-sm text-secondaryText">{message}</p>
      </div>
      {children}
      <button
        autoFocus
        onClick={handleCloseModal}
        className="text-primaryText mt-2 p-2 px-8 bg-primary cursor-pointer hover:bg-primary/80 rounded-xl text-nowrap"
      >
        Done
      </button>
    </div>
  );
}

export default SuccessView;
