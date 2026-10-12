import { XMarkIcon } from "@heroicons/react/24/outline";

type ErrorViewProps = {
  handleCloseModal: () => void;
  heading: string;
  message: string;
};
function ErrorView({ handleCloseModal, heading, message }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-10 px-6 h-82 ">
      <div className="bg-danger/10 p-3 rounded-full">
        <XMarkIcon className="size-10 text-danger" />
      </div>
      <div>
        <p className="text-lg font-semibold text-primaryText">{heading}</p>
        <p className="text-sm text-secondaryText">{message}</p>
      </div>
      <button
        autoFocus
        onClick={handleCloseModal}
        className="text-primaryText mt-2 p-2 px-8 bg-primary cursor-pointer hover:bg-primary/80 rounded-xl text-nowrap"
      >
        Close
      </button>
    </div>
  );
}

export default ErrorView;
