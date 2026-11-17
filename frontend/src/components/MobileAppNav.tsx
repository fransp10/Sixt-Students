import { useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import type { NavItemType } from "../types/NavItem";
import LogoutButton from "./LogoutButton";
import NavItem from "./NavItem";
import sixtStudentsLogo from "../assets/sixtStudentsLogo.png";
import CurrentUserBadge from "./CurrentUserBadge";

type MobileAppNavProps = {
  navItems: NavItemType[];
};

type TopBarProps = {
  icon: React.ReactNode;
  handleToggleNav: () => void;
};

function TopBar({ icon, handleToggleNav }: TopBarProps) {
  return (
    <div className="flex h-18 items-center justify-between border-b border-borderDividers px-4 ">
      <img
        src={sixtStudentsLogo}
        alt="Sixt Students App"
        className="h-auto w-33"
      />
      <div className=" items-center gap-2 flex">
        <button
          onClick={handleToggleNav}
          className="flex size-11 items-center justify-center rounded-lg border border-borderDividers bg-cardBG text-secondaryText cursor-pointer hover:bg-cardBGHover hover:text-primaryText hover:border-primaryText transition-colors duration-200"
        >
          {icon}
        </button>
      </div>
    </div>
  );
}

function MobileAppNav({ navItems }: MobileAppNavProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // keep the dialog in sync with state; the guards stop StrictMode's double effect from throwing
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isNavOpen && !dialog.open) dialog.showModal();
    if (!isNavOpen && dialog.open) dialog.close();
  }, [isNavOpen]);

  return (
    <header className="sticky top-0 z-50 bg-surfaceSideBar lg:hidden">
      <TopBar
        icon={<Bars3Icon className="size-6" />}
        handleToggleNav={() => setIsNavOpen(true)}
      />

      <dialog
        ref={dialogRef}
        onClose={() => setIsNavOpen(false)}
        className="m-0 h-dvh max-w-none max-h-none w-full bg-surfaceSideBar text-primaryText"
      >
        <div className="flex h-full flex-col">
          <TopBar
            icon={<XMarkIcon className="size-6" />}
            handleToggleNav={() => setIsNavOpen(false)}
          />

          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <p className="mb-2 ml-4 text-xs font-semibold uppercase tracking-wider text-secondaryText">
              Menu
            </p>
            <ul className="flex flex-col gap-1 font-semibold">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  closeNav={() => setIsNavOpen(false)}
                  {...item}
                />
              ))}
              <CurrentUserBadge size="large" />
            </ul>
          </nav>
          <div className="shrink-0 ">
            <LogoutButton />
          </div>
        </div>
      </dialog>
    </header>
  );
}

export default MobileAppNav;
