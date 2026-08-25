import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Header from "../components/layout/Header.jsx";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}