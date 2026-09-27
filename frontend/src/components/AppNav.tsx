import sixtStudentsLogo from "../assets/sixtStudentsLogo.png";
import type { NavItemType } from "../types/navItem";
import LogoutButton from "./LogoutButton";
import NavItem from "./NavItem";

type AppNav = {
  navItems: NavItemType[];
};

function AppNav({ navItems }: AppNav) {
  return (
    <div
      className="
      hidden
        h-screen
        w-60
        shrink-0
        flex-col
        border-r border-borderDividers
        bg-surfaceSideBar
        p-4
        lg:flex"
    >
      <img src={sixtStudentsLogo} width={244} height={122} />
      <nav className=" mt-6 w-full flex-1   ">
        <ul className="flex flex-col text-primaryText font-semibold">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              end={item.end}
            />
          ))}
        </ul>
      </nav>
      <LogoutButton />
    </div>
  );
}

export default AppNav;
