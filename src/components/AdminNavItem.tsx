import type { ComponentType, SVGProps } from "react";
import { NavLink } from "react-router-dom";

type AdminNavItemProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  to: string;
  end?: boolean;
};

function AdminNavItem({ icon: Icon, label, to, end }: AdminNavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex  items-center gap-4 rounded-l p-4 text-2xl   transition-colors ${
            isActive
              ? "border-primary border-l-6 bg-primary/10 text-primary "
              : "  hover:text-primaryText text-secondaryText "
          }`
        }
      >
        <Icon className="size-8 shrink-0" />
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

export default AdminNavItem;
