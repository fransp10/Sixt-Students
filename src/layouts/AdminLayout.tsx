import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";

function AdminLayout() {
  return (
    <div className="lg:flex min-h-screen overflow-hidden bg-pageBackground">
      <aside className="hidden h-screen w-64 shrink-0 lg:flex">
        <AdminNav />
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6 lg:h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
