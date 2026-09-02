import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth.js";
import NotificationDropdown from "../../features/notifications/components/NotificationDropdown.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "SA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
      {/* Left Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right Icons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <NotificationDropdown />
        </div>

        <div className="w-px h-7 bg-slate-200 mx-1" />

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
            {getInitials(user?.name || "Super Admin")}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-snug">
              {user?.name || "Super Admin"}
            </p>
            <p className="text-[11px] font-medium text-slate-400 leading-none">
              {user?.roleId?.name || "SUPER_ADMIN"}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition ml-1 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}