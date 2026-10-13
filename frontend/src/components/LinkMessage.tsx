import ErrorLink from "../pages/Error/ErrorLink";
import sixtStudentsLogo from "../assets/sixtStudentsLogo.png";

function LinkMessage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-2 sm:gap-4 bg-pageBackground">
      <img
        src={sixtStudentsLogo}
        alt="Sixt Students"
        className="h-26 xs:h-42 sm:h-48"
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 font-semibold text-lg xs:text-2xl sm:text-3xl">
          <h1 className="text-primary">{title}</h1>
          <h1 className="text-primaryText">{subtitle}</h1>
        </div>
        <ErrorLink />
      </div>
    </div>
  );
}
export default LinkMessage;
