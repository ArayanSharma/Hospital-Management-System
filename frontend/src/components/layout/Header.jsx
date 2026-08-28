import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Mail, Menu, LogOut } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth.js";
import NotificationDropdown from "../../features/notifications/components/NotificationDropdown.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchTerm.trim())}`);
    }
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

      {/* Center Search Box with Ctrl + K Badge */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xl mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patients, appointments, invoices..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-20 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-400 shadow-2xs">
            Ctrl + K
          </div>
        </div>
      </form>

      {/* Right Icons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <NotificationDropdown />
        </div>

        {/* Message Mail Icon */}
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition cursor-pointer"
        >
          <Mail className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        <div className="w-px h-7 bg-slate-200 mx-1" />

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
            {getInitials(user?.name || "Dr. Admin")}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-snug">
              {user?.name || "Dr. Admin"}
            </p>
            <p className="text-[11px] font-medium text-slate-400 leading-none">
              {user?.roleId?.name || "Super Admin"}
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