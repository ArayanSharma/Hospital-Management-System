import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FlaskConical, Check } from "lucide-react";
import { getLabTestByIdApi, updateLabTestStatusApi } from "../services/labTest.api.js";
import { getLabReportByTestIdApi, createLabReportApi, finalizeLabReportApi } from "../services/labReport.api.js";
import ResultsForm from "../components/ResultsForm.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function LabTestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const testRes = await getLabTestByIdApi(id);
      setTest(testRes.data.data);
      try {
        const reportRes = await getLabReportByTestIdApi(id);
        setReport(reportRes.data.data);
      } catch {
        setReport(null); // report abhi nahi bani
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleCollectSample = async () => {
    try {
      await updateLabTestStatusApi(id, { status: "sample-collected" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleSaveResults = async (formData) => {
    setSubmitting(true);
    try {
      await createLabReportApi({ labTestId: id, ...formData });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save results");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (!confirm("Finalize this report? It cannot be edited after finalizing.")) return;
    setSubmitting(true);
    try {
      await finalizeLabReportApi(report._id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to finalize report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading test..." />;
  if (error) return <ErrorState message={error} />;
  if (!test) return null;

  const statusBadgeMap = { pending: "pending", "sample-collected": "pending", completed: "completed", cancelled: "cancelled" };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to lab tests
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{test.testName}</p>
              <p className="text-xs text-gray-500">{test.sampleType} · {test.patientId?.name}</p>
            </div>
          </div>
          <Badge status={statusBadgeMap[test.status]} label={test.status.replace("-", " ")} />
        </div>
      </div>

      {test.status === "pending" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600 mb-3">Sample has not been collected yet.</p>
          <Button onClick={handleCollectSample}>Mark Sample Collected</Button>
        </div>
      )}

      {test.status !== "pending" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Test Results</h2>

          {!report ? (
            <ResultsForm onSubmit={handleSaveResults} submitting={submitting} />
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                {Object.entries(report.results || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600">{key}</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
              {report.interpretation && (
                <p className="text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <span className="font-medium">Interpretation:</span> {report.interpretation}
                </p>
              )}

              {report.status === "draft" && (
                <Button onClick={handleFinalize} disabled={submitting} className="w-full">
                  <span className="flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Finalize Report
                  </span>
                </Button>
              )}
              {report.status === "finalized" && (
                <div className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2 text-center">
                  Report finalized
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
