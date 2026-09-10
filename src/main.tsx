import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage.tsx";
import SchedulePage from "./pages/Admin/AdminSchedulePage.tsx";
import StudentsPage from "./pages/Admin/AdminStudentsPage.tsx";
import EarningsPage from "./pages/EarningsPage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import AdminChosenStudentPage from "./components/Admin/AdminChosenStudentPage.tsx";
import AdminStudentNoStudentSelected from "./components/Admin/AdminStudentNoStudentSelected.tsx";
import AdminChosenStudentShiftsPage from "./pages/Admin/AdminChosenStudentShiftsPage.tsx";
import AdminChosenStudentManagePage from "./pages/Admin/AdminChosenStudentManagePage.tsx";
import OverviewPage from "./pages/OverviewPage.tsx";
import AdminChosenStudentContractsPage from "./components/Admin/AdminChosenStudentContractsPage.tsx";
import AppLayout from "./layouts/AppLayout.tsx";
import { adminNavItems, studentNavItems } from "./config/navigation.ts";
import AppNav from "./components/AppNav.tsx";
import StudentDashboardPage from "./pages/Students/StudentDashboardPage.tsx";
import StudentSchedulePage from "./pages/Students/StudentSchedulePage.tsx";
import StudentContractsPage from "./pages/Students/StudentContractsPage.tsx";
import StudentSettingsPage from "./pages/Students/StudentSettingsPage,.tsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     errorElement: <NotFoundPage />,
//     element: <ProtectedRoute />,
//     children: [
//       {
//         path: "/admin",
//         element: <AdminDashboardPage />,
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
// ]);

const router = createBrowserRouter([
  {
    path: "/admin",
    errorElement: <NotFoundPage />,
    element: <AppLayout navItems={adminNavItems} />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
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
            path: ":studentId",
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
                element: <AdminChosenStudentShiftsPage />,
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
        path: "students/:studentId",
        element: <AdminChosenStudentPage />,
      },

      {
        path: "earnings",
        element: <EarningsPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
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
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
