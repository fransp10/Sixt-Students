import {
  BanknotesIcon,
  CalendarDateRangeIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import sixtStudentsLogo from "../assets/sixtStudentsLogo.png";
import AdminNavItem from "./AdminNavItem";
import LogoutButton from "./LogoutButton";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: HomeIcon,
    end: true,
  },
  {
    label: "Schedule",
    to: "/admin/schedule",
    icon: CalendarIcon,
  },
  {
    label: "Students",
    to: "/admin/students",
    icon: UsersIcon,
  },

  {
    label: "Shifts",
    to: "/admin/shifts",
    icon: CalendarDateRangeIcon,
  },
  {
    label: "Earnings",
    to: "/admin/earnings",
    icon: BanknotesIcon,
  },
  {
    label: "Reports",
    to: "/admin/reports",
    icon: ChartBarIcon,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: Cog6ToothIcon,
  },
];

function AdminNav() {
  return (
    <div
      className="
      hidden
        h-screen
        w-60
        shrink-0
        flex-col
        border-r border-borderDividers
        bg-pageBackground
        p-4
        lg:flex"
    >
      <img src={sixtStudentsLogo} width={244} height={122} />
      <nav className=" mt-6 w-full flex-1   ">
        <ul className="flex flex-col text-primaryText font-semibold">
          {navItems.map((item) => (
            <AdminNavItem
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

export default AdminNav;
