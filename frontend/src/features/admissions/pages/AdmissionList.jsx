import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { getAdmissionsApi, createAdmissionApi, dischargePatientApi } from "../services/admission.api.js";
import Table from "../../../components/ui/Table.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import AdmissionForm from "../components/AdmissionForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function AdmissionList() {
  const [admissions, setAdmissions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAdmissionsApi({ page, limit: 10 });
      setAdmissions(data.data.admissions || []);
      setPagination(data.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admissions");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchAdmissions(); }, [fetchAdmissions]);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await createAdmissionApi(formData);
      setModalOpen(false);
      fetchAdmissions();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDischarge = async (admission) => {
    const summary = prompt("Discharge summary:");
    if (!summary) return;
    try {
      await dischargePatientApi(admission._id, summary);
      fetchAdmissions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to discharge patient");
    }
  };

  const columns = [
    { key: "patient", label: "Patient", render: (row) => row.patientId?.name },
    { key: "doctor", label: "Doctor", render: (row) => `Dr. ${row.doctorId?.userId?.name || row.doctorId?.name || ""}` },
    { key: "ward", label: "Ward", render: (row) => `${row.wardId?.name || ""} · ${row.bedId?.bedNumber || ""}` },
    { key: "date", label: "Admitted On", render: (row) => row.admissionDate ? new Date(row.admissionDate).toLocaleDateString() : "-" },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status === "admitted" ? "pending" : "completed"} label={row.status} /> },
    {
      key: "actions", label: "",
      render: (row) =>
        row.status === "admitted" && (
          <button onClick={() => handleDischarge(row)} className="text-sm text-green-600 hover:underline cursor-pointer">
            Discharge
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admissions</h1>
          <p className="text-sm text-gray-500">Inpatient admissions and discharge</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Admit Patient</span>
        </Button>
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <>
          <Table columns={columns} data={admissions} emptyMessage="No admissions found" />
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Admit Patient">
        <AdmissionForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
