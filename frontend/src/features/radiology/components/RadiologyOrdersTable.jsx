import React from "react";
import {
  Eye,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Disc,
  Activity,
  Scan,
  Heart,
  Radio,
  Sparkles,
  Inbox,
} from "lucide-react";
import { getInitials } from "../../../utils/formatters.js";
import { formatReportDate } from "../helpers/radiologyReportFormatter.js";

// Helper for rendering modality-specific icons
const getModalityIcon = (modality) => {
  const m = String(modality || "").toLowerCase();
  if (m.includes("x-ray")) {
    return { icon: Layers, bg: "bg-blue-50 text-blue-600" };
  }
  if (m.includes("mri")) {
    return { icon: Disc, bg: "bg-purple-50 text-purple-600" };
  }
  if (m.includes("ct")) {
    return { icon: Scan, bg: "bg-emerald-50 text-emerald-600" };
  }
  if (m.includes("ultrasound") || m.includes("usg")) {
    return { icon: Radio, bg: "bg-cyan-50 text-cyan-600" };
  }
  if (m.includes("mammo")) {
    return { icon: Sparkles, bg: "bg-pink-50 text-pink-600" };
  }
  if (m.includes("pet")) {
    return { icon: Activity, bg: "bg-orange-50 text-orange-600" };
  }
  if (m.includes("ecg")) {
    return { icon: Heart, bg: "bg-rose-50 text-rose-600" };
  }
  return { icon: Layers, bg: "bg-slate-50 text-slate-600" };
};

export default function RadiologyOrdersTable({
  orders = [],
  selectedOrder,
  onSelectOrder,
  onStatusChange,
  onDeleteOrder,
}) {
  const displayOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3.5">Order ID</th>
              <th className="py-3 px-3.5">Patient</th>
              <th className="py-3 px-3.5">Age / Gender</th>
              <th className="py-3 px-3.5">Modality</th>
              <th className="py-3 px-3.5">Body Region</th>
              <th className="py-3 px-3.5">Priority</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5">Scheduled Date &amp; Time</th>
              <th className="py-3 px-3.5">Ordered By</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {displayOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-600 text-sm">No radiology test orders found</p>
                    <p className="text-xs text-slate-400">
                      Click &quot;Order Radiology Test&quot; above to create a new scan order.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              displayOrders.map((row) => {
                const { icon: ModalityIcon, bg: modalityBg } = getModalityIcon(row.modality);
                const pName = row.patientName || row.patientId?.name || "Patient";
                const pUhid = row.patientId?.patientId || row.patientId?._id || row.patientId || "N/A";
                const gender = row.patientId?.gender || "N/A";
                const dob = row.patientId?.dateOfBirth;
                let ageStr = "N/A";
                if (dob) {
                  const birthYear = new Date(dob).getFullYear();
                  const currentYear = new Date().getFullYear();
                  ageStr = `${currentYear - birthYear} Y`;
                }
                const ageGender = row.ageGender || `${ageStr} / ${gender}`;
                const dName = row.doctorName || row.doctorId?.userId?.name || row.doctorId?.name || "Doctor";
                const isSelected = selectedOrder && (selectedOrder._id === row._id || selectedOrder.orderId === row.orderId);

                const dateDisplay = row.scheduledAt
                  ? formatReportDate(row.scheduledAt)
                  : row.createdAt
                  ? formatReportDate(row.createdAt)
                  : "Unscheduled";

                return (
                  <tr
                    key={row._id || row.orderId}
                    onClick={() => onSelectOrder && onSelectOrder(row)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? "bg-blue-50/60 font-medium" : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Order ID */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-xs font-bold text-blue-600">
                      {row.orderId || "RO-N/A"}
                    </td>

                    {/* Patient Cell (Avatar + Name + UHID) */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {row.patientId?.photoUrl ? (
                          <img
                            src={row.patientId.photoUrl}
                            alt={pName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {getInitials(pName)}
                          </div>
                        )}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900 text-xs">{pName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{pUhid}</p>
                        </div>
                      </div>
                    </td>

                    {/* Age / Gender */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-semibold text-slate-700">
                      {ageGender}
                    </td>

                    {/* Modality Cell (Modality Icon + Label) */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${modalityBg}`}
                        >
                          <ModalityIcon className="w-3.5 h-3.5" />
                        </div>
                        <span>{row.modality || row.testType || "X-Ray"}</span>
                      </div>
                    </td>

                    {/* Body Region */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-semibold text-slate-700">
                      {row.bodyRegion || row.bodyPart || "Chest"}
                    </td>

                    {/* Priority Badge */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {row.priority === "emergency" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-2xs">
                          Emergency
                        </span>
                      ) : row.priority === "urgent" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          Urgent
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Routine
                        </span>
                      )}
                    </td>

                    {/* Status Select Badge */}
                    <td className="py-3 px-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={row.status || "pending"}
                        onChange={(e) => {
                          if (onStatusChange && row._id) {
                            onStatusChange(row._id, e.target.value);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border focus:outline-none cursor-pointer transition ${
                          row.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : row.status === "in-progress"
                            ? "bg-cyan-50 text-cyan-700 border-cyan-300"
                            : row.status === "scheduled"
                            ? "bg-blue-50 text-blue-700 border-blue-300"
                            : row.status === "cancelled"
                            ? "bg-slate-100 text-slate-600 border-slate-300"
                            : "bg-amber-50 text-amber-700 border-amber-300"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Scheduled Date & Time */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-medium text-slate-800 text-xs">
                      {dateDisplay}
                    </td>

                    {/* Ordered By (Doctor Name) */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="leading-tight text-xs">
                        <p className="font-bold text-slate-900">{dName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Physician</p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectOrder && onSelectOrder(row)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteOrder && row._id && onDeleteOrder(row._id)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectOrder && onSelectOrder(row)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium text-[11px]">
          Showing {displayOrders.length > 0 ? 1 : 0} to {displayOrders.length} of {displayOrders.length} entries
        </p>

        <div className="flex items-center gap-4 self-center sm:self-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center gap-1 border border-slate-200 rounded-xl px-2.5 py-1 bg-white text-xs font-bold text-slate-700 cursor-default">
            <span>{displayOrders.length} / page</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
