import React, { useState, useRef, useEffect } from "react";
import { Eye, Edit2, MoreVertical, ChevronLeft, ChevronRight, TestTube, CheckCircle, FileText, Upload, Printer, History, XCircle, AlertCircle } from "lucide-react";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import { formatDate, formatTime, getInitials } from "../../../utils/formatters.js";
import LabStatusBadge from "./LabStatusBadge.jsx";

function LabOrderActionsDropdown({ testItem, onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (actionKey) => {
    setIsOpen(false);
    onAction(actionKey, testItem);
  };

  const status = testItem.status || "pending";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer border border-slate-200/80"
        title="More Options"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out"
        >
          {/* Status === "pending" */}
          {status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => handleSelect("view-order")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>View Order</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("edit-order")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Edit Order</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("collect-sample")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
              >
                <TestTube className="w-3.5 h-3.5 text-purple-600" />
                <span>Collect Sample</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("mark-collected")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>Mark as Collected</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                type="button"
                onClick={() => handleSelect("cancel-order")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Cancel Order</span>
              </button>
            </>
          )}

          {/* Status === "sample-collected" */}
          {status === "sample-collected" && (
            <>
              <button
                type="button"
                onClick={() => handleSelect("view-order")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>View Order</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("view-sample")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
              >
                <TestTube className="w-3.5 h-3.5 text-purple-600" />
                <span>View Sample Details</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("enter-result")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Enter / Update Result</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("upload-report")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Upload Report</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("verify-result")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Verify Result</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("complete-order")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Complete Order</span>
              </button>
            </>
          )}

          {/* Status === "completed" */}
          {status === "completed" && (
            <>
              <button
                type="button"
                onClick={() => handleSelect("view-order")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>View Order</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("view-report")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>View Lab Report</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("print-report")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print / Download Report</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("view-history")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-slate-600" />
                <span>View Result History</span>
              </button>
            </>
          )}

          {/* Status === "cancelled" */}
          {status === "cancelled" && (
            <>
              <button
                type="button"
                onClick={() => handleSelect("view-order")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>View Order</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect("view-cancellation")}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>View Cancellation Details</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function LabOrdersTable({
  tests,
  loading,
  error,
  page,
  setPage,
  pagination,
  selectedTest,
  onSelectTest,
  onAction,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Table Data */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loading message="Loading lab test orders..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : tests.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No laboratory test orders found matching criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3.5 w-8 text-center">#</th>
                <th className="py-3 px-3.5">Order ID</th>
                <th className="py-3 px-3.5">Patient</th>
                <th className="py-3 px-3.5">Doctor</th>
                <th className="py-3 px-3.5">Test Name</th>
                <th className="py-3 px-3.5">Sample Type</th>
                <th className="py-3 px-3.5">Priority</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Order Date</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {tests.map((testItem, index) => {
                const isSelected = selectedTest?._id === testItem._id;
                const rowNumber = ((page - 1) * 10) + index + 1;
                const orderIdDisplay = testItem.orderId || `LT-2026-${String(index + 1).padStart(4, "0")}`;

                const patient = testItem.patientId;
                const patientName = patient?.name || "Patient";
                const patientUhid = patient?.patientId || "PAT-000123";

                const doctor = testItem.doctorId;
                const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
                const specName = doctor?.specialization || "General Physician";

                const sampleType = testItem.sampleType || "Blood";

                return (
                  <tr
                    key={testItem._id}
                    onClick={() => onSelectTest(testItem)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/60 border-l-4 border-l-blue-600"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center font-semibold text-slate-400 text-[11px]">
                      {rowNumber}
                    </td>

                    {/* Order ID */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-xs font-bold text-slate-900">
                      {orderIdDisplay}
                    </td>

                    {/* Patient Cell */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {patient?.photoUrl ? (
                          <img
                            src={patient.photoUrl}
                            alt={patientName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {getInitials(patientName)}
                          </div>
                        )}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900 text-xs">{patientName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{patientUhid}</p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor Cell */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="leading-tight text-xs">
                        <p className="font-bold text-slate-900">Dr. {doctorName.replace(/^Dr\.\s*/i, "")}</p>
                        <p className="text-[10px] text-slate-400">{specName}</p>
                      </div>
                    </td>

                    {/* Test Name Cell */}
                    <td className="py-3 px-3.5 font-bold text-slate-800 text-xs max-w-[180px] truncate">
                      {testItem.testName}
                    </td>

                    {/* Sample Type Cell */}
                    <td className="py-3 px-3.5 font-semibold text-slate-600 text-xs">
                      {sampleType}
                    </td>

                    {/* Priority Badge */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {testItem.priority === "emergency" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-2xs">
                          Emergency
                        </span>
                      ) : testItem.priority === "urgent" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          Urgent
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Routine
                        </span>
                      )}
                    </td>

                    {/* Reusable Status Badge */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <LabStatusBadge status={testItem.status} />
                    </td>

                    {/* Order Date & Time Cell */}
                    <td className="py-3 px-3.5 whitespace-nowrap leading-tight text-xs">
                      <p className="font-medium text-slate-800">{formatDate(testItem.requestedAt || testItem.createdAt)}</p>
                      <p className="text-slate-400 text-[10px]">{formatTime(testItem.requestedAt || testItem.createdAt)}</p>
                    </td>

                    {/* Actions Cell: [ 👁 ] [ ✏️ ] [ ⋮ ] */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onAction("view-order", testItem)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onAction("edit-order", testItem)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                          title="Edit Order"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <LabOrderActionsDropdown testItem={testItem} onAction={onAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium text-[11px]">
          Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination?.total || tests.length)} of {pagination?.total || tests.length} entries
        </p>
        <div className="flex items-center gap-1 self-center sm:self-auto">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            {page}
          </button>
          <button
            disabled={page >= (pagination?.totalPages || 1)}
            onClick={() => setPage(page + 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
