import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { getInvoicesApi, createInvoiceApi } from "../services/invoice.api.js";
import Table from "../../../components/ui/Table.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import InvoiceForm from "../components/InvoiceForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getInvoicesApi({ page, limit: 10 });
      setInvoices(data.data.invoices);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      const { data } = await createInvoiceApi(formData);
      setModalOpen(false);
      navigate(`/billing/${data.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const statusMap = { unpaid: "pending", "partially-paid": "pending", paid: "completed", cancelled: "cancelled" };

  const columns = [
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "patient", label: "Patient", render: (row) => row.patientId?.name },
    { key: "total", label: "Total", render: (row) => `₹${row.total.toFixed(2)}` },
    { key: "paid", label: "Paid", render: (row) => `₹${row.amountPaid.toFixed(2)}` },
    { key: "status", label: "Status", render: (row) => <Badge status={statusMap[row.status]} label={row.status.replace("-", " ")} /> },
    {
      key: "actions", label: "",
      render: (row) => (
        <button onClick={() => navigate(`/billing/${row._id}`)} className="text-sm text-blue-600 hover:underline">
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500">Manage patient invoices</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> New Invoice</span>
        </Button>
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <>
          <Table columns={columns} data={invoices} emptyMessage="No invoices found" />
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Invoice">
        <InvoiceForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}