import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth.js";
import NotificationDropdown from "../../features/notifications/components/NotificationDropdown.jsx";
import ThemeToggle from "../common/ThemeToggle.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "US";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30 transition-colors duration-300">
      {/* Left Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right Icons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Mode Switcher */}
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative">
          <NotificationDropdown />
        </div>

        <div className="w-px h-7 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-1">
          {user?.photoUrl || user?.avatar || user?.photoURL ? (
            <img
              src={user.photoUrl || user.avatar || user.photoURL}
              alt={user?.name || "User"}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
              onError={(e) => {
                // If image fails to load, hide image and fallback to initials
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs items-center justify-center shadow-sm shadow-blue-500/20 shrink-0"
            style={{ display: user?.photoUrl || user?.avatar || user?.photoURL ? 'none' : 'flex' }}
          >
            {getInitials(user?.name || "User")}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400 leading-none uppercase">
              {user?.roleName || (typeof user?.roleId === "object" ? user?.roleId?.name : user?.role) || "User"}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition ml-1 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}