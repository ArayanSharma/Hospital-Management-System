import { NavLink } from "react-router-dom";
import { navigationItems } from "../../config/navigation.js";
import { usePermission } from "../../hooks/usePermission.js";

export default function Sidebar() {
  const { hasPermission } = usePermission();

  const visibleItems = navigationItems.filter((item) =>
    hasPermission(item.permission),
  );

  return (
    <aside className="w-60 bg-gray-900 text-gray-300 flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-gray-800">
        <h1 className="text-white font-semibold text-sm">
          Hospital Management
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
