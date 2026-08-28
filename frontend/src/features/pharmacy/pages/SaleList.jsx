import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { getPharmacySalesApi, createPharmacySaleApi, markSaleAsPaidApi } from "../services/pharmacySale.api.js";
import Table from "../../../components/ui/Table.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import SaleForm from "../components/SaleForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function SaleList() {
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPharmacySalesApi({ page, limit: 10 });
      setSales(data.data.sales);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      const payload = {
        patientId: formData.patientId || undefined,
        medicines: formData.medicines.map((m) => ({
          medicineId: m.medicineId,
          inventoryItemId: m.inventoryItemId,
          quantity: Number(m.quantity),
        })),
      };
      await createPharmacySaleApi(payload);
      setModalOpen(false);
      fetchSales();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (sale) => {
    try {
      await markSaleAsPaidApi(sale._id);
      fetchSales();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update payment status");
    }
  };

  const columns = [
    { key: "patient", label: "Patient", render: (row) => row.patientId?.name || "Walk-in" },
    { key: "medicines", label: "Items", render: (row) => `${row.medicines.length} item(s)` },
    { key: "total", label: "Total", render: (row) => `₹${row.totalAmount.toFixed(2)}` },
    { key: "soldBy", label: "Sold By", render: (row) => row.soldBy?.name },
    {
      key: "status", label: "Payment",
      render: (row) => <Badge status={row.paymentStatus === "paid" ? "completed" : "pending"} label={row.paymentStatus} />,
    },
    {
      key: "actions", label: "",
      render: (row) =>
        row.paymentStatus === "pending" && (
          <button onClick={() => handleMarkPaid(row)} className="text-sm text-green-600 hover:underline">
            Mark Paid
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pharmacy Sales</h1>
          <p className="text-sm text-gray-500">Medicine sales and dispensing</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> New Sale</span>
        </Button>
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <>
          <Table columns={columns} data={sales} emptyMessage="No sales found" />
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Pharmacy Sale">
        <SaleForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}