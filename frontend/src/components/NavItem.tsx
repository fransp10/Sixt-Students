import { NavLink } from "react-router-dom";
import type { NavItemType } from "../types/NavItem";

function NavItem({ icon: Icon, label, to, end, closeNav }: NavItemType) {
  return (
    <li className="w-full">
      <NavLink
        to={to}
        end={end}
        onClick={closeNav ? () => closeNav() : undefined}
        className={({ isActive }) =>
          `flex flex-1 items-center gap-4 rounded-l p-4 text-xl    transition-colors ${
            isActive
              ? "border-primary border-l-6 bg-primary/10  text-primary "
              : "  hover:text-primaryText text-secondaryText "
          }`
        }
      >
        <Icon className="size-6 shrink-0 ml-4" />
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

export default NavItem;
