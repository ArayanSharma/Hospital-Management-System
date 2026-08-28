import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Scan, Check } from "lucide-react";
import { getRadiologyTestByIdApi, updateRadiologyTestStatusApi } from "../services/radiologyTest.api.js";
import { getRadiologyReportByTestIdApi, createRadiologyReportApi, finalizeRadiologyReportApi } from "../services/radiologyReport.api.js";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function RadiologyTestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const testRes = await getRadiologyTestByIdApi(id);
      setTest(testRes.data.data);
      try {
        const reportRes = await getRadiologyReportByTestIdApi(id);
        setReport(reportRes.data.data);
      } catch {
        setReport(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSchedule = async () => {
    try {
      await updateRadiologyTestStatusApi(id, { status: "scheduled" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!findings.trim()) return alert("Findings are required");
    setSubmitting(true);
    try {
      await createRadiologyReportApi({ testId: id, findings, impression });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (!confirm("Finalize this report?")) return;
    setSubmitting(true);
    try {
      await finalizeRadiologyReportApi(report._id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to finalize");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading test..." />;
  if (error) return <ErrorState message={error} />;
  if (!test) return null;

  const statusMap = { pending: "pending", scheduled: "pending", completed: "completed", cancelled: "cancelled" };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to radiology
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Scan className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{test.testType} {test.bodyPart && `· ${test.bodyPart}`}</p>
              <p className="text-xs text-gray-500">{test.patientId?.name}</p>
            </div>
          </div>
          <Badge status={statusMap[test.status]} label={test.status} />
        </div>
      </div>

      {test.status === "pending" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600 mb-3">Test not yet scheduled.</p>
          <Button onClick={handleSchedule}>Mark as Scheduled</Button>
        </div>
      )}

      {test.status !== "pending" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Radiology Report</h2>

          {!report ? (
            <form onSubmit={handleSaveReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Findings</label>
                <textarea value={findings} onChange={(e) => setFindings(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Impression</label>
                <textarea value={impression} onChange={(e) => setImpression(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Report"}</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Findings</p>
                <p className="text-sm text-gray-800">{report.findings}</p>
              </div>
              {report.impression && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Impression</p>
                  <p className="text-sm text-gray-800">{report.impression}</p>
                </div>
              )}
              {report.status === "draft" && (
                <Button onClick={handleFinalize} disabled={submitting} className="w-full">
                  <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4" /> Finalize Report</span>
                </Button>
              )}
              {report.status === "finalized" && (
                <div className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2 text-center">Report finalized</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
