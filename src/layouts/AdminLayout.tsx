import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-pageBackground">
      <AdminNav />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
