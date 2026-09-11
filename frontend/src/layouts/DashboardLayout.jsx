import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Header from "../components/layout/Header.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary.jsx";

export default function DashboardLayout() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Intercept header menu button click on mobile screen sizes
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const menuBtn = e.target.closest("header button");
      if (menuBtn && window.innerWidth < 768) {
        setIsMobileOpen((prev) => !prev);
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 antialiased overflow-hidden">
      {/* Desktop Sidebar (visible on md screens and above) */}
      <div className="hidden md:flex md:w-64 md:flex-col shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay & Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-[280px] bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col h-full overflow-y-auto animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full h-full overflow-hidden">
        <Header />
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
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