import { LogOut } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.roleId?.name}</p>
        </div>
        <button
          onClick={logout}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </header>
  );
}