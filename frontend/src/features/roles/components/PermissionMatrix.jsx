import React from "react";
import {
  User,
  UserCheck,
  Calendar,
  CreditCard,
  Pill,
  FlaskConical,
  FileImage,
  Package,
  Users,
  Shield,
  FileText,
  Search,
  Download,
  Info,
  CheckCircle2,
  Eye,
  Edit3,
  XCircle,
  RotateCcw,
  Save,
} from "lucide-react";
import { MODULE_DETAILS } from "../constants/role.constants.js";

const ICON_MAP = {
  User,
  UserCheck,
  Calendar,
  CreditCard,
  Pill,
  FlaskConical,
  FileImage,
  Package,
  Users,
  Shield,
  FileText,
};

export default function PermissionMatrix({
  roles = [],
  selectedRoleName = "DOCTOR",
  onSelectRole,
  matrixDraft = {},
  matrixSearch = "",
  onSearchChange,
  onCellClick,
  onResetChanges,
  onSaveChanges,
  onExportMatrix,
  hasChanges = false,
  saving = false,
}) {
  // Filter modules based on matrixSearch
  const filteredModules = MODULE_DETAILS.filter(
    (mod) =>
      mod.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      mod.desc.toLowerCase().includes(matrixSearch.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* 1. Control Bar Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Select Role Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Select Role
            </span>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <select
                value={selectedRoleName}
                onChange={(e) => onSelectRole(e.target.value)}
                className="pl-8 pr-8 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none min-w-[170px]"
              >
                {roles.map((r) => (
                  <option key={r._id || r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Module Search Input */}
          <div className="flex flex-col gap-1 flex-1 max-w-xs min-w-[200px]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider opacity-0">
              Search
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={matrixSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search module..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Export Matrix Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onExportMatrix}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Matrix</span>
          </button>
        </div>
      </div>

      {/* 2. Instructional Banner matching Screenshot */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs font-semibold text-blue-800">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>Set access level for each module. Click on any cell to change permission.</span>
      </div>

      {/* 3. Main Permission Grid Table */}
      <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[760px]">
          <thead>
            {/* Top Level Header */}
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th colSpan={2} className="py-3 px-4 w-[280px]">
                Modules
              </th>
              <th colSpan={4} className="py-2.5 px-4 text-center border-l border-slate-200/80">
                Access Level
              </th>
            </tr>

            {/* Access Level Columns Header */}
            <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] font-bold text-slate-600">
              <th className="w-10 text-center py-2 text-slate-400 font-mono">#</th>
              <th className="py-2 px-3">Module Name</th>

              {/* Full Access Column */}
              <th className="py-2 px-3 text-center border-l border-slate-100 w-[120px]">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-black text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Full Access</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">All Actions</span>
                </div>
              </th>

              {/* Read Only Column */}
              <th className="py-2 px-3 text-center border-l border-slate-100 w-[120px]">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-blue-700 font-black text-xs">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Read Only</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">Read Only</span>
                </div>
              </th>

              {/* Limited Access Column */}
              <th className="py-2 px-3 text-center border-l border-slate-100 w-[120px]">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-amber-700 font-black text-xs">
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Limited Access</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">Some Actions</span>
                </div>
              </th>

              {/* No Access Column */}
              <th className="py-2 px-3 text-center border-l border-slate-100 w-[120px]">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-rose-700 font-black text-xs">
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>No Access</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">No Access</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredModules.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                  No modules match your search "{matrixSearch}".
                </td>
              </tr>
            ) : (
              filteredModules.map((mod) => {
                const IconComp = ICON_MAP[mod.icon] || Shield;
                const currentStatus = matrixDraft[mod.name] || "No Access";

                return (
                  <tr key={mod.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Row Index Number */}
                    <td className="py-3 px-2 text-center text-[11px] font-bold text-slate-400 font-mono">
                      {mod.id}
                    </td>

                    {/* Module Title & Subtitle */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${mod.color}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{mod.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{mod.desc}</p>
                        </div>
                      </div>
                    </td>

                    {/* 1. Full Access Radio Button Cell */}
                    <td
                      onClick={() => onCellClick(mod.name, "Full Access")}
                      className="py-3 px-3 text-center border-l border-slate-100 cursor-pointer hover:bg-emerald-50/40 transition"
                    >
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                            currentStatus === "Full Access"
                              ? "border-emerald-600 bg-emerald-600"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {currentStatus === "Full Access" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Read Only Radio Button Cell */}
                    <td
                      onClick={() => onCellClick(mod.name, "Read Only")}
                      className="py-3 px-3 text-center border-l border-slate-100 cursor-pointer hover:bg-blue-50/40 transition"
                    >
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                            currentStatus === "Read Only"
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {currentStatus === "Read Only" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 3. Limited Access Radio Button Cell */}
                    <td
                      onClick={() => onCellClick(mod.name, "Limited Access")}
                      className="py-3 px-3 text-center border-l border-slate-100 cursor-pointer hover:bg-amber-50/40 transition"
                    >
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                            currentStatus === "Limited Access"
                              ? "border-amber-500 bg-amber-500"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {currentStatus === "Limited Access" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 4. No Access Radio Button Cell */}
                    <td
                      onClick={() => onCellClick(mod.name, "No Access")}
                      className="py-3 px-3 text-center border-l border-slate-100 cursor-pointer hover:bg-rose-50/40 transition"
                    >
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                            currentStatus === "No Access"
                              ? "border-rose-500 bg-rose-500"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {currentStatus === "No Access" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Footer Row matching Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <p className="text-[11px] text-slate-500 font-medium italic">
          <span className="font-bold text-slate-700 not-italic">Note:</span> Changes will apply to all users assigned with this role.
        </p>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onResetChanges}
            disabled={!hasChanges}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Changes</span>
          </button>

          <button
            type="button"
            onClick={onSaveChanges}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
