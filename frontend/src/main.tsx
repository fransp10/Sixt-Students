import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login.tsx";
import NotFoundPage from "./pages/Error/NotFoundPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage.tsx";
import SchedulePage from "./pages/Admin/AdminSchedulePage.tsx";
import StudentsPage from "./pages/Admin/AdminStudentsPage.tsx";
import EarningsPage from "./pages/EarningsPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import AdminChosenStudentPage from "./components/Admin/AdminChosenStudentPage.tsx";
import AdminStudentNoStudentSelected from "./components/Admin/AdminStudentNoStudentSelected.tsx";
import AdminChosenStudentManagePage from "./pages/Admin/AdminChosenStudentManagePage.tsx";
import OverviewPage from "./pages/OverviewPage.tsx";
import AdminChosenStudentContractsPage from "./components/Admin/AdminChosenStudentContractsPage.tsx";
import AppLayout from "./layouts/AppLayout.tsx";
import { adminNavItems, studentNavItems } from "./config/navigation.ts";
import StudentDashboardPage from "./pages/Students/StudentDashboardPage.tsx";
import StudentSchedulePage from "./pages/Students/StudentSchedulePage.tsx";
import StudentContractsPage from "./pages/Students/StudentContractsPage.tsx";
import StudentSettingsPage from "./pages/Students/StudentSettingsPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RequireRole from "./pages/RequireRole.tsx";
import Unauthorized from "./pages/Error/Unauthorized.tsx";
import { AuthContextProvider } from "./context/Providers/AuthContexProvider.tsx";
import ShiftHistoryPage from "./components/Admin/ShiftHistoryPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import { StudentsProvider } from "./context/Providers/StudentsContextProvider.tsx";
import AdminContractsPage from "./pages/Admin/AdminContractsPage.tsx";
import AdminEarningsPage from "./pages/Admin/AdminEarningsPage.tsx";
import IndexPageRouter from "./pages/IndexPageRouter.tsx";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RequireRole requiredRole="admin" />,
        children: [
          {
            path: "/admin",
            errorElement: <NotFoundPage />,
            element: <AppLayout navItems={adminNavItems} />,
            children: [
              {
                index: true,
                element: <StudentsProvider children={<AdminDashboardPage />} />,
              },
              {
                path: "schedule",
                element: <SchedulePage />,
              },
              {
                path: "students",
                element: <StudentsPage />,
                children: [
                  { index: true, element: <AdminStudentNoStudentSelected /> },
                  {
                    path: ":userId",
                    element: <AdminChosenStudentPage />,
                    children: [
                      {
                        index: true,
                        element: <Navigate to="overview" replace />,
                      },
                      {
                        path: "overview",
                        element: <OverviewPage />,
                      },
                      {
                        path: "shifts",
                        index: true,
                        element: <ShiftHistoryPage />,
                      },
                      {
                        path: "manage",
                        index: true,
                        element: <AdminChosenStudentManagePage />,
                      },
                      {
                        path: "contracts",
                        index: true,
                        element: <AdminChosenStudentContractsPage />,
                      },
                    ],
                  },
                ],
              },

              {
                path: "earnings",
                element: <AdminEarningsPage />,
              },
              {
                path: "contracts",
                index: true,
                element: <AdminContractsPage />,
              },
              {
                path: "settings",
                element: <SettingsPage />,
              },
            ],
          },
        ],
      },
      {
        element: <RequireRole requiredRole="student" />,
        children: [
          {
            path: "/student",
            element: <AppLayout navItems={studentNavItems} />,
            errorElement: <NotFoundPage />,
            children: [
              {
                index: true,
                element: <Navigate to="/student/dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <StudentDashboardPage />,
              },
              {
                path: "schedule",
                element: <StudentSchedulePage />,
              },
              {
                path: "contracts",
                element: <StudentContractsPage />,
              },
              {
                path: "earnings",
                element: <EarningsPage />,
              },
              {
                path: "settings",
                element: <StudentSettingsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  { index: true, path: "/", element: <IndexPageRouter /> },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/reset-password/", element: <ResetPasswordPage /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFoundPage /> },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
