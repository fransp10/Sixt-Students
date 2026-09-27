import { Outlet } from "react-router-dom";
import AppNav from "../components/AppNav";
import type { NavItemType } from "../types/navItem";

type AppLayoutProps = {
  navItems: NavItemType[];
};

function AppLayout({ navItems }: AppLayoutProps) {
  return (
    <div className="lg:flex min-h-screen  overflow-hidden bg-pageBackground scrollbar-thumb-stone-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      <aside className="hidden h-screen w-64 shrink-0 lg:flex">
        <AppNav navItems={navItems} />
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto scrollbar-thin p-4  lg:p-6 lg:h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
