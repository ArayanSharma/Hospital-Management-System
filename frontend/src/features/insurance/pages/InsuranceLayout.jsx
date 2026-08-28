import { NavLink, Outlet, useLocation } from "react-router-dom";

const TABS = [
  { label: "Policies", path: "/insurance/policies", aliasPaths: ["/insurance", "/insurance/policies"] },
  { label: "Claims", path: "/insurance/claims", aliasPaths: ["/insurance/claims"] },
];

export default function InsuranceLayout() {
  const location = useLocation();

  return (
    <div className="space-y-5">
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {TABS.map((tab) => {
            const isActive = tab.aliasPaths.includes(location.pathname);
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`pb-3 text-sm font-medium border-b-2 transition ${
                  isActive
                    ? "border-gray-900 text-gray-900 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
