import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Header from "../components/layout/Header.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary.jsx";

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800 antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <ErrorBoundary
            key={location.pathname}
            title="Page Error"
            message="This page ran into a problem. Try navigating elsewhere or reload."
          >
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}