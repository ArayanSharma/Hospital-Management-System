import { NavLink, useLocation } from "react-router-dom";
import { Plus, Headset, ChevronDown } from "lucide-react";
import { navigationItems } from "../../config/navigation.js";
import { usePermission } from "../../hooks/usePermission.js";

const SECTIONS = [
  {
    title: "Overview",
    paths: ["/"],
  },
  {
    title: "Administration",
    paths: ["/users", "/roles", "/permissions"],
  },
  {
    title: "Hospital",
    paths: [
      "/patients",
      "/doctors",
      "/departments",
      "/appointments",
      "/opd-visits",
      "/ipd",
      "/laboratory",
      "/radiology",
    ],
  },
  {
    title: "Operations",
    paths: ["/pharmacy", "/billing", "/insurance"],
  },
  {
    title: "System",
    paths: ["/reports", "/audit-logs", "/settings"],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { hasPermission } = usePermission();

  const visibleItemsMap = new Map(
    navigationItems
      .filter((item) => !item.permission || hasPermission(item.permission))
      .map((item) => [item.path, item])
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-slate-900 font-bold text-base leading-tight tracking-tight">
            CityCare
          </h1>
          <p className="text-xs font-medium text-slate-400 leading-none mt-0.5">
            Hospital
          </p>
        </div>
      </div>

      {/* Navigation List grouped by SECTIONS */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto custom-scrollbar">
        {SECTIONS.map((section) => {
          const sectionItems = section.paths
            .map((path) => visibleItemsMap.get(path))
            .filter(Boolean);

          if (sectionItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                {section.title}
              </p>
              {sectionItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) => {
                    const isCustomActive =
                      isActive || (item.path === "/" && location.pathname === "/dashboard");
                    return `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                      isCustomActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`;
                  }}
                >
                  {({ isActive }) => {
                    const isCustomActive =
                      isActive || (item.path === "/" && location.pathname === "/dashboard");
                    return (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <item.icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isCustomActive
                                ? "text-white"
                                : "text-slate-400 group-hover:text-slate-700"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.hasSub && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 ${
                                isCustomActive ? "text-white/80" : "text-slate-400"
                              }`}
                            />
                          )}
                          {item.badge && (
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500 text-white shadow-xs">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </>
                    );
                  }}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Support Card */}
      <div className="p-4 m-3 bg-gradient-to-b from-blue-50/90 to-blue-50/40 border border-blue-100 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600 shrink-0">
            <Headset className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Need Help?</h4>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
              We're here to help you
            </p>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Contact Support
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 text-[11px] text-slate-400 border-t border-slate-100">
        © 2025 CityCare Hospital<br />All rights reserved.
      </div>
    </aside>
  );
}
