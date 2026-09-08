import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../../../lib/axios.js";
import { getRadiologyReportByTestIdApi, createRadiologyReportApi, updateRadiologyReportApi } from "../../services/radiologyReport.api.js";

export default function RadiologyFindingsModal({ order, isOpen, onClose, onSuccess }) {
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [existingReport, setExistingReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (order?._id && isOpen) {
      setLoading(true);
      setErrorMsg("");

      // Fetch live report data from DB if exists
      getRadiologyReportByTestIdApi(order._id)
        .then(({ data }) => {
          if (!isMounted) return;
          const report = data?.data;
          if (report) {
            setExistingReport(report);
            setFindings(report.findings || order.findings || "");
            setImpression(report.impression || order.impression || "");
          } else {
            setFindings(order.findings || "");
            setImpression(order.impression || "");
          }
        })
        .catch(() => {
          if (!isMounted) return;
          setFindings(order.findings || "");
          setImpression(order.impression || "");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [order, isOpen]);

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Update RadiologyTest document
      await api.patch(`/radiology-tests/${order._id}`, {
        findings,
        impression,
      });

      // 2. Sync / Save to RadiologyReport document
      if (existingReport?._id) {
        await updateRadiologyReportApi(existingReport._id, {
          findings,
          impression,
        });
      } else {
        await createRadiologyReportApi({
          testId: order._id,
          findings,
          impression,
          status: "draft",
        });
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save findings and report sync");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Radiologist Report Findings & Impression"
      subtitle={`Order #${order.orderId || order._id} — ${order.modality || "X-Ray"} (${order.bodyRegion || "Chest"})`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-semibold text-xs animate-pulse">
            Fetching report findings from database...
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Detailed Diagnostic Findings</label>
              <textarea
                rows={4}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Describe radiograph observations, lesion measurements, tissue density..."
                className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none resize-none font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Final Radiological Impression / Conclusion</label>
              <textarea
                rows={2}
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
                placeholder="e.g. Normal chest radiograph with clear lung fields..."
                className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none resize-none font-bold"
              />
            </div>
          </>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? "Syncing & Saving..." : "Save Findings"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
