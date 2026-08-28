import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getWardsApi, createWardApi } from "../../wards/services/ward.api.js";
import { getBedsApi, createBedApi, updateBedStatusApi } from "../services/bed.api.js";
import { BED_STATUS_CONFIG } from "../bedStatusConfig.js";
import BedCard from "../components/BedCard.jsx";
import WardForm from "../../wards/components/WardForm.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function BedGrid() {
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBed, setSelectedBed] = useState(null);
  const [wardModalOpen, setWardModalOpen] = useState(false);
  const [bedModalOpen, setBedModalOpen] = useState(false);
  const [bedNumberInput, setBedNumberInput] = useState("");
  const [selectedWardForBed, setSelectedWardForBed] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wardsRes, bedsRes] = await Promise.all([getWardsApi(), getBedsApi()]);
      setWards(wardsRes.data.data);
      setBeds(bedsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ward data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateWard = async (formData) => {
    setSubmitting(true);
    try {
      await createWardApi(formData);
      setWardModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBed = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createBedApi({ wardId: selectedWardForBed, bedNumber: bedNumberInput });
      setBedModalOpen(false);
      setBedNumberInput("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetMaintenance = async () => {
    const reason = prompt("Reason for maintenance:");
    if (!reason) return;
    try {
      await updateBedStatusApi(selectedBed._id, { status: "maintenance", maintenanceReason: reason });
      setSelectedBed(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update bed");
    }
  };

  const handleSetAvailable = async () => {
    try {
      await updateBedStatusApi(selectedBed._id, { status: "available" });
      setSelectedBed(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update bed");
    }
  };

  if (loading) return <Loading message="Loading ward layout..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Wards & Beds</h1>
          <p className="text-sm text-gray-500">Visual bed occupancy overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setWardModalOpen(true)}>
            <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> New Ward</span>
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        {Object.entries(BED_STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-3 h-3 rounded ${cfg.color.split(" ")[0]} border ${cfg.color.split(" ")[1]}`} />
            {cfg.label}
          </div>
        ))}
      </div>

      {wards.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400 border border-gray-200 rounded-lg bg-white">
          No wards created yet
        </div>
      ) : (
        wards.map((ward) => {
          const wardBeds = beds.filter((b) => b.wardId?._id === ward._id || b.wardId === ward._id);
          const occupiedCount = wardBeds.filter((b) => b.status === "occupied").length;

          return (
            <div key={ward._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {ward.name} <span className="text-gray-400 font-normal capitalize">· {ward.type}</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    {occupiedCount} / {ward.capacity} beds occupied
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedWardForBed(ward._id); setBedModalOpen(true); }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                >
                  + Add Bed
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {wardBeds.map((bed) => (
                  <BedCard key={bed._id} bed={bed} onClick={setSelectedBed} />
                ))}
              </div>
            </div>
          );
        })
      )}

      <Modal isOpen={wardModalOpen} onClose={() => setWardModalOpen(false)} title="Create Ward">
        <WardForm onSubmit={handleCreateWard} onCancel={() => setWardModalOpen(false)} submitting={submitting} />
      </Modal>

      <Modal isOpen={bedModalOpen} onClose={() => setBedModalOpen(false)} title="Add Bed">
        <form onSubmit={handleCreateBed} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number</label>
            <input
              value={bedNumberInput}
              onChange={(e) => setBedNumberInput(e.target.value)}
              placeholder="e.g. A-101"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setBedModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Bed"}</Button>
          </div>
        </form>
      </Modal>

      {/* Bed detail modal */}
      <Modal isOpen={!!selectedBed} onClose={() => setSelectedBed(null)} title={`Bed ${selectedBed?.bedNumber}`}>
        {selectedBed && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${BED_STATUS_CONFIG[selectedBed.status]?.color || ""}`}>
                {BED_STATUS_CONFIG[selectedBed.status]?.label}
              </span>
            </div>

            {selectedBed.status === "occupied" && selectedBed.currentPatientId && (
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-xs text-gray-500">Current Patient</p>
                <p className="text-sm font-medium text-gray-900">{selectedBed.currentPatientId.name}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {selectedBed.status === "available" && (
                <Button variant="secondary" onClick={handleSetMaintenance} className="flex-1">
                  Set Under Maintenance
                </Button>
              )}
              {selectedBed.status === "maintenance" && (
                <Button onClick={handleSetAvailable} className="flex-1">
                  Mark Available
                </Button>
              )}
              {selectedBed.status === "occupied" && (
                <p className="text-xs text-gray-500 text-center flex-1">
                  Discharge the patient from Admissions to free this bed
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
