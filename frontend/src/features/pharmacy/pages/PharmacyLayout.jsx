import { NavLink, Outlet, useLocation } from "react-router-dom";

const TABS = [
  { label: "Medicines", path: "/pharmacy/medicines", aliasPaths: ["/pharmacy", "/pharmacy/medicines"] },
  { label: "Inventory", path: "/pharmacy/inventory", aliasPaths: ["/pharmacy/inventory"] },
  { label: "Sales", path: "/pharmacy/sales", aliasPaths: ["/pharmacy/sales"] },
  { label: "Suppliers", path: "/pharmacy/suppliers", aliasPaths: ["/pharmacy/suppliers"] },
];

export default function PharmacyLayout() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy</h1>
        <p className="text-sm text-gray-500">Manage medicines, stock inventory, and pharmacy sales</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          {TABS.map((tab) => {
            const isActive = tab.aliasPaths.includes(location.pathname);
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-semibold"
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