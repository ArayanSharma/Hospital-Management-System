import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Stethoscope, Thermometer, Heart, Activity, Weight, Ruler } from "lucide-react";
import { getOPDVisitByIdApi, updateOPDVisitApi } from "../services/opdVisit.api.js";
import { getPrescriptionsByVisitApi, createPrescriptionApi } from "../../prescriptions/services/prescription.api.js";
import PrescriptionForm from "../../prescriptions/components/PrescriptionForm.jsx";
import PrescriptionCard from "../../prescriptions/components/PrescriptionCard.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

const VITAL_ICONS = {
  temperature: Thermometer,
  bloodPressure: Heart,
  pulse: Activity,
  weight: Weight,
  height: Ruler,
};

const VITAL_LABELS = {
  temperature: "Temperature",
  bloodPressure: "Blood Pressure",
  pulse: "Pulse",
  weight: "Weight",
  height: "Height",
};

const VITAL_UNITS = {
  temperature: "°F",
  bloodPressure: "",
  pulse: "bpm",
  weight: "kg",
  height: "cm",
};

export default function VisitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [savingPrescription, setSavingPrescription] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await getPrescriptionsByVisitApi(id);
      setPrescriptions(data.data);
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
    }
  };

  useEffect(() => {
    if (visit) fetchPrescriptions();
  }, [visit]);

  const handleCreatePrescription = async (formData) => {
    setSavingPrescription(true);
    try {
      await createPrescriptionApi({
        patientId: visit.patientId._id,
        doctorId: visit.doctorId._id,
        visitId: visit._id,
        visitType: "OPDVisit",
        ...formData,
      });
      setShowPrescriptionForm(false);
      fetchPrescriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save prescription");
    } finally {
      setSavingPrescription(false);
    }
  };

  const fetchVisit = async () => {
    setLoading(true);
    try {
      const { data } = await getOPDVisitByIdApi(id);
      setVisit(data.data);
      setDiagnosis(data.data.diagnosis || "");
      setNotes(data.data.notes || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load visit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisit();
  }, [id]);

  const handleCompleteVisit = async () => {
    if (!diagnosis.trim()) {
      alert("Diagnosis is required to complete the visit");
      return;
    }
    setSaving(true);
    try {
      await updateOPDVisitApi(id, { diagnosis, notes, status: "completed" });
      fetchVisit();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete visit");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await updateOPDVisitApi(id, { diagnosis, notes });
      fetchVisit();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading visit..." />;
  if (error) return <ErrorState message={error} />;
  if (!visit) return null;

  const isCompleted = visit.status === "completed";
  const vitals = visit.vitals || {};
  const hasVitals = Object.values(vitals).some((v) => v);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to visits
      </button>

      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{visit.patientId?.name}</h1>
              <p className="text-sm text-gray-500">
                {visit.patientId?.patientId} · {visit.patientId?.gender} ·{" "}
                {visit.patientId?.dateOfBirth &&
                  `${new Date().getFullYear() - new Date(visit.patientId.dateOfBirth).getFullYear()} yrs`}
              </p>
            </div>
          </div>
          <Badge status={isCompleted ? "completed" : "pending"} label={isCompleted ? "Completed" : "In Progress"} />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
          <Stethoscope className="w-4 h-4 text-gray-400" />
          Dr. {visit.doctorId?.userId?.name} · {visit.doctorId?.specialization}
          <span className="text-gray-300 mx-1">·</span>
          {new Date(visit.visitDate).toLocaleDateString(undefined, {
            day: "numeric", month: "short", year: "numeric",
          })}
        </div>
      </div>

      {/* Vitals card */}
      {hasVitals && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Vitals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(vitals).map(([key, value]) => {
              if (!value) return null;
              const Icon = VITAL_ICONS[key];
              return (
                <div key={key} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-1.5">
                    <Icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {value} <span className="text-xs font-normal text-gray-400">{VITAL_UNITS[key]}</span>
                  </p>
                  <p className="text-[11px] text-gray-400">{VITAL_LABELS[key]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Symptoms */}
      {visit.symptoms && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Symptoms</h2>
          <p className="text-sm text-gray-700">{visit.symptoms}</p>
        </div>
      )}

      {/* Diagnosis & Notes — editable if not completed */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Diagnosis & Notes</h2>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Diagnosis</label>
          {isCompleted ? (
            <p className="text-sm text-gray-800">{diagnosis || "—"}</p>
          ) : (
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={2}
              placeholder="Enter diagnosis..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
          {isCompleted ? (
            <p className="text-sm text-gray-800">{notes || "—"}</p>
          ) : (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          )}
        </div>

        {!isCompleted && (
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button variant="secondary" onClick={handleSaveDraft} disabled={saving}>
              Save Draft
            </Button>
            <Button onClick={handleCompleteVisit} disabled={saving}>
              {saving ? "Completing..." : "Complete Visit"}
            </Button>
          </div>
        )}
      </div>

      {/* Prescriptions section */}
      <div className="space-y-4">
        {prescriptions.map((p) => (
          <PrescriptionCard key={p._id} prescription={p} />
        ))}

        {!isCompleted && !showPrescriptionForm && (
          <button
            onClick={() => setShowPrescriptionForm(true)}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition"
          >
            + Add Prescription
          </button>
        )}

        {showPrescriptionForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">New Prescription</h2>
            <PrescriptionForm onSubmit={handleCreatePrescription} submitting={savingPrescription} />
          </div>
        )}
      </div>
    </div>
  );
}