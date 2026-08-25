import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import Dashboard from "../features/super-admin/pages/Dashboard.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          // Yahan aage saare protected pages add honge
          // { path: "dashboard", element: <Dashboard /> },
          { index: true, element: <Dashboard /> },
        ],
      },
    ],
  },
]);
