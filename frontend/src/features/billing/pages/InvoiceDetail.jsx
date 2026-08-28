import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt } from "lucide-react";
import { getInvoiceByIdApi } from "../services/invoice.api.js";
import { getPaymentsByInvoiceApi, createPaymentApi } from "../services/payment.api.js";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import PaymentForm from "../components/PaymentForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invoiceRes, paymentsRes] = await Promise.all([
        getInvoiceByIdApi(id),
        getPaymentsByInvoiceApi(id),
      ]);
      setInvoice(invoiceRes.data.data);
      setPayments(paymentsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRecordPayment = async (formData) => {
    setSubmitting(true);
    try {
      await createPaymentApi({ invoiceId: id, ...formData });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading invoice..." />;
  if (error) return <ErrorState message={error} />;
  if (!invoice) return null;

  const remainingAmount = invoice.total - invoice.amountPaid;
  const statusMap = { unpaid: "pending", "partially-paid": "pending", paid: "completed", cancelled: "cancelled" };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /> Back to invoices
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* Receipt header */}
        <div className="flex items-start justify-between pb-4 border-b border-dashed border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{invoice.invoiceNumber}</p>
              <p className="text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge status={statusMap[invoice.status]} label={invoice.status.replace("-", " ")} />
        </div>

        <div className="py-4 border-b border-dashed border-gray-200">
          <p className="text-xs text-gray-500">Billed To</p>
          <p className="text-sm font-medium text-gray-900">{invoice.patientId?.name}</p>
          <p className="text-xs text-gray-500">{invoice.patientId?.phone}</p>
        </div>

        {/* Line items */}
        <div className="py-4 border-b border-dashed border-gray-200 space-y-2">
          {invoice.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.description} <span className="text-gray-400">× {item.quantity}</span></span>
              <span className="text-gray-900">₹{item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="py-4 border-b border-dashed border-gray-200 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>₹{invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Discount</span><span>-₹{invoice.discount.toFixed(2)}</span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span><span>₹{invoice.tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-gray-900 pt-1.5 border-t border-gray-100">
            <span>Total</span><span>₹{invoice.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>Paid</span><span>₹{invoice.amountPaid.toFixed(2)}</span>
          </div>
          {remainingAmount > 0 && (
            <div className="flex justify-between text-sm font-medium text-amber-600">
              <span>Balance Due</span><span>₹{remainingAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Payment history */}
        {payments.length > 0 && (
          <div className="py-4">
            <p className="text-xs font-medium text-gray-500 mb-2">PAYMENT HISTORY</p>
            <div className="space-y-1.5">
              {payments.map((p) => (
                <div key={p._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{p.method} · {new Date(p.paidAt).toLocaleDateString()}</span>
                  <span className="text-gray-900">₹{p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {remainingAmount > 0 && invoice.status !== "cancelled" && (
          <div className="pt-4">
            <Button onClick={() => setModalOpen(true)} className="w-full">Record Payment</Button>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Payment">
        <PaymentForm remainingAmount={remainingAmount} onSubmit={handleRecordPayment} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}