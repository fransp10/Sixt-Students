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
import ShiftsPage from "./pages/ShiftsPage.tsx";
import StudentsPage from "./pages/Admin/AdminStudentsPage.tsx";
import EarningsPage from "./pages/EarningsPage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminChosenStudentPage from "./components/Admin/AdminChosenStudentPage.tsx";
import AdminStudentNoStudentSelected from "./components/Admin/AdminStudentNoStudentSelected.tsx";
import AdminChosenStudentShiftsPage from "./pages/Admin/AdminChosenStudentShiftsPage.tsx";
import AdminChosenStudentManagePage from "./pages/Admin/AdminChosenStudentManagePage.tsx";
import AdminChosenStudentEarningsPage from "./pages/Admin/AdminChosenStudentEarningsPage.tsx";
import OverviewPage from "./pages/OverviewPage.tsx";

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
    element: <AdminLayout />,
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
                path: "Manage",
                index: true,
                element: <AdminChosenStudentManagePage />,
              },
              {
                path: "Earnings",
                index: true,
                element: <AdminChosenStudentEarningsPage />,
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
        path: "shifts",
        element: <ShiftsPage />,
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
