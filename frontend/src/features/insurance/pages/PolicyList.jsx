import { useState, useEffect, useCallback } from "react";
import { Plus, Shield, User } from "lucide-react";
import { getPoliciesApi, createPolicyApi } from "../services/insurancePolicy.api.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import PolicyForm from "../components/PolicyForm.jsx";
import Loading from "../../../components/common/Loading.jsx";

export default function PolicyList() {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPolicies = useCallback(async (patientId) => {
    setLoading(true);
    try {
      const params = patientId ? { patientId } : {};
      const { data } = await getPoliciesApi(params);
      setPolicies(data.data || []);
    } catch (err) {
      console.error(err);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies(selectedPatientId);
  }, [selectedPatientId, fetchPolicies]);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await createPolicyApi(formData);
      setModalOpen(false);
      setSelectedPatientId(formData.patientId);
      fetchPolicies(formData.patientId);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors = { active: "completed", expired: "cancelled", inactive: "pending" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Insurance Policies</h1>
          <p className="text-sm text-gray-500">View all policies or filter by patient</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Policy</span>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-80">
          <PatientAutocomplete
            value={selectedPatientId}
            onChange={(id) => setSelectedPatientId(id)}
          />
        </div>
        {selectedPatientId && (
          <button
            onClick={() => setSelectedPatientId("")}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            Clear Patient Filter
          </button>
        )}
      </div>

      {loading && <Loading message="Loading insurance policies..." />}

      {!loading && policies.length === 0 && (
        <div className="text-center py-12 text-sm text-gray-400 border border-gray-200 rounded-lg bg-white">
          {selectedPatientId ? "No policies found for this patient" : "No insurance policies found"}
        </div>
      )}

      {!loading && policies.length > 0 && (
        <div className="grid gap-3">
          {policies.map((policy) => (
            <div key={policy._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{policy.providerName}</p>
                    <p className="text-xs text-gray-500">
                      Policy #{policy.policyNumber} · <span className="font-mono text-[10px] text-gray-400">ID: {policy._id}</span>
                    </p>
                    {policy.patientId && (
                      <p className="text-xs text-indigo-600 font-medium mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3" /> {policy.patientId.name}
                      </p>
                    )}
                  </div>
                </div>
                <Badge status={statusColors[policy.status] || "pending"} label={policy.status} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Coverage</p>
                  <p className="font-medium text-gray-900">₹{policy.coverageAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Valid From</p>
                  <p className="text-gray-700">{policy.validFrom ? new Date(policy.validFrom).toLocaleDateString() : "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Valid Until</p>
                  <p className="text-gray-700">{policy.validUntil ? new Date(policy.validUntil).toLocaleDateString() : "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Insurance Policy">
        <PolicyForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
