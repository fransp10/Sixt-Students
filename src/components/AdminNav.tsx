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
    <div className="w-96 h-screen  flex flex-col items-center p-2 pb-8 border-borderDividers border-2">
      <img src={sixtStudentsLogo} width={244} height={122} />
      <nav className=" h-max w-full  bg-pageBackground p-2 ">
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
