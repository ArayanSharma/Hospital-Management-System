import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_REPORT_DATA,
  formatReportDate,
} from "../helpers/radiologyReportFormatter.js";
import {
  getRadiologyReportByTestIdApi,
  createRadiologyReportApi,
  updateRadiologyReportApi,
  finalizeRadiologyReportApi,
} from "../services/radiologyReport.api.js";

export function useRadiologyReport(selectedOrder, onReportUpdated) {
  const [activeTab, setActiveTab] = useState("study-details");
  const [reportId, setReportId] = useState(null);
  const [reportStatus, setReportStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_REPORT_DATA);
  const [historyLogs, setHistoryLogs] = useState([]);

  const loadReportForOrder = useCallback(async () => {
    if (!selectedOrder) {
      setReportId(null);
      setFormData(DEFAULT_REPORT_DATA);
      setHistoryLogs([]);
      return;
    }

    setActiveTab("study-details");
    const pName = selectedOrder.patientName || selectedOrder.patientId?.name || "Unassigned Patient";
    const pId = selectedOrder.patientId?.patientId || selectedOrder.patientId?._id || selectedOrder.patientId || "N/A";
    const oId = selectedOrder.orderId || "RO-N/A";
    const modality = selectedOrder.modality || selectedOrder.testType || "X-Ray";
    const bodyRegion = selectedOrder.bodyRegion || selectedOrder.bodyPart || "Chest";
    const doctorName = selectedOrder.doctorName || selectedOrder.doctorId?.userId?.name || selectedOrder.doctorId?.name || "Ordering Physician";

    const initialFormData = {
      patientName: pName,
      patientId: pId,
      orderId: oId,
      modality: modality,
      testName: selectedOrder.testType || `${modality} - ${bodyRegion}`,
      bodyRegion: bodyRegion,
      studyDate: selectedOrder.scheduledAt ? formatReportDate(selectedOrder.scheduledAt) : formatReportDate(selectedOrder.createdAt),
      studyTime: selectedOrder.scheduledAt ? new Date(selectedOrder.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A",
      priority: selectedOrder.priority || "routine",
      technique: `Standard ${modality} protocol obtained for ${bodyRegion.toLowerCase()} evaluation.`,
      findings: "",
      impression: "",
      recommendations: "",
      additionalNotes: selectedOrder.clinicalInstructions ? `Clinical Instructions: ${selectedOrder.clinicalInstructions}` : "",
      technicianName: "Rakesh Kumar",
      checkedByName: doctorName,
      studyReviewed: true,
      clinicalIndication: selectedOrder.clinicalInstructions || `Evaluation of ${bodyRegion.toLowerCase()}`,
      relevantHistory: "",
      examinationTechnique: `${modality} scan of ${bodyRegion}`,
      bodyPart: bodyRegion,
      views: "Standard Views",
      contrast: "Not Used",
      imageQuality: "Diagnostic",
      images: selectedOrder.attachmentUrl ? [selectedOrder.attachmentUrl] : [],
    };

    setFormData(initialFormData);
    setReportStatus(selectedOrder.status === "completed" ? "finalized" : "draft");

    // Fetch existing report from DB if selectedOrder has valid MongoDB ID
    if (selectedOrder._id) {
      try {
        const res = await getRadiologyReportByTestIdApi(selectedOrder._id);
        if (res.data?.data) {
          const rep = res.data.data;
          setReportId(rep._id);
          setReportStatus(rep.status || "draft");
          setFormData((prev) => ({
            ...prev,
            technique: rep.technique || prev.technique,
            findings: rep.findings || prev.findings,
            impression: rep.impression || prev.impression,
            recommendations: rep.recommendations || prev.recommendations,
            additionalNotes: rep.additionalNotes || prev.additionalNotes,
            technicianName: rep.technicianName || prev.technicianName,
            checkedByName: rep.checkedByName || prev.checkedByName,
            studyReviewed: rep.studyReviewed !== undefined ? rep.studyReviewed : true,
            clinicalIndication: rep.clinicalIndication || prev.clinicalIndication,
            relevantHistory: rep.relevantHistory || prev.relevantHistory,
            examinationTechnique: rep.examinationTechnique || prev.examinationTechnique,
            bodyPart: rep.bodyPart || prev.bodyPart,
            views: rep.views || prev.views,
            contrast: rep.contrast || prev.contrast,
            imageQuality: rep.imageQuality || prev.imageQuality,
            images: rep.images && rep.images.length > 0 ? rep.images : prev.images,
          }));

          const updatedTime = rep.updatedAt ? formatReportDate(rep.updatedAt) : formatReportDate(new Date());
          setHistoryLogs([
            {
              id: `REV-${rep._id.slice(-6)}`,
              version: rep.status === "finalized" ? "v1.1 (Finalized)" : "v1.0 (Draft)",
              updatedAt: updatedTime,
              updatedBy: rep.radiologistId?.name || doctorName,
              status: rep.status || "draft",
              notes: rep.status === "finalized" ? "Finalized report saved to database." : "Draft report saved to database.",
              findingsSnippet: rep.findings ? rep.findings.slice(0, 80) + "..." : "No findings recorded yet.",
            },
          ]);
        } else {
          setReportId(null);
          setHistoryLogs([]);
        }
      } catch {
        setReportId(null);
        setHistoryLogs([]);
      }
    }
  }, [selectedOrder]);

  useEffect(() => {
    loadReportForOrder();
  }, [loadReportForOrder]);

  const handleChange = (field, value) => {
    if (reportStatus === "finalized") return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async () => {
    if (!selectedOrder?._id) {
      alert("No valid radiology test selected.");
      return;
    }
    if (reportStatus === "finalized") {
      alert("Finalized reports cannot be saved as draft.");
      return;
    }
    setSaving(true);
    try {
      if (reportId) {
        await updateRadiologyReportApi(reportId, { ...formData, status: "draft" });
      } else {
        const res = await createRadiologyReportApi({
          testId: selectedOrder._id,
          ...formData,
          status: "draft",
        });
        if (res.data?.data?._id) setReportId(res.data.data._id);
      }
      setReportStatus("draft");
      alert("Radiology report draft saved successfully to database!");
      if (onReportUpdated) onReportUpdated();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save report draft to database.";
      alert(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFinalizeReport = async () => {
    if (!selectedOrder?._id) {
      alert("No valid radiology test selected.");
      return;
    }
    if (reportStatus === "finalized") {
      alert("This radiology report is already finalized.");
      return;
    }

    if (!formData.technique || !formData.technique.trim()) {
      alert("Please enter Technique before finalizing the report.");
      return;
    }
    if (!formData.findings || !formData.findings.trim()) {
      alert("Please enter Findings before finalizing the report.");
      return;
    }
    if (!formData.impression || !formData.impression.trim()) {
      alert("Please enter Impression before finalizing the report.");
      return;
    }

    setSaving(true);
    try {
      if (reportId) {
        await updateRadiologyReportApi(reportId, { ...formData, status: "draft" });
        await finalizeRadiologyReportApi(reportId);
      } else {
        const res = await createRadiologyReportApi({
          testId: selectedOrder._id,
          ...formData,
          status: "finalized",
        });
        if (res.data?.data?._id) {
          setReportId(res.data.data._id);
        }
      }
      setReportStatus("finalized");
      alert("Radiology report finalized and approved successfully!");
      if (onReportUpdated) onReportUpdated();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to finalize report in database.";
      alert(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    reportId,
    reportStatus,
    saving,
    formData,
    setFormData,
    historyLogs,
    handleChange,
    handleSaveDraft,
    handleFinalizeReport,
    refreshReport: loadReportForOrder,
  };
}
