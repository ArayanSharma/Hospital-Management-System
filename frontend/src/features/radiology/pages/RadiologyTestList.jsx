import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { getRadiologyTestsApi, createRadiologyTestApi } from "../services/radiologyTest.api.js";
import Table from "../../../components/ui/Table.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import RadiologyTestForm from "../components/RadiologyTestForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function RadiologyTestList() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getRadiologyTestsApi({ page, limit: 10 });
      setTests(data.data.tests || []);
      setPagination(data.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      const { data } = await createRadiologyTestApi(formData);
      setModalOpen(false);
      navigate(`/radiology/${data.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const statusMap = { pending: "pending", scheduled: "pending", completed: "completed", cancelled: "cancelled" };

  const columns = [
    { key: "patient", label: "Patient", render: (row) => row.patientId?.name },
    { key: "test", label: "Test", render: (row) => `${row.testType} ${row.bodyPart ? `· ${row.bodyPart}` : ""}` },
    { key: "status", label: "Status", render: (row) => <Badge status={statusMap[row.status]} label={row.status} /> },
    {
      key: "actions", label: "",
      render: (row) => (
        <button onClick={() => navigate(`/radiology/${row._id}`)} className="text-sm text-blue-600 hover:underline cursor-pointer">View</button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Radiology</h1>
          <p className="text-sm text-gray-500">Imaging test orders and reports</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Order Test</span>
        </Button>
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <>
          <Table columns={columns} data={tests} emptyMessage="No radiology tests found" />
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Order Radiology Test">
        <RadiologyTestForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
