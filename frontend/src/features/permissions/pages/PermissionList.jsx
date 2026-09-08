import { useState, useEffect } from "react";
import { Plus, KeyRound } from "lucide-react";
import { getPermissionsApi, createPermissionApi, deletePermissionApi } from "../services/permission.api.js";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import PermissionForm from "../components/PermissionForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

const ACTION_COLORS = {
  create: "bg-green-100 text-green-700",
  read: "bg-blue-100 text-blue-700",
  update: "bg-amber-100 text-amber-700",
  delete: "bg-red-100 text-red-700",
  manage: "bg-purple-100 text-purple-700",
};

export default function PermissionList() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data } = await getPermissionsApi();
      setPermissions(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPermissions(); }, []);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await createPermissionApi(formData);
      setModalOpen(false);
      fetchPermissions();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (perm) => {
    if (!confirm(`Delete permission "${perm.name}"? Any role using it will lose this access.`)) return;
    try {
      await deletePermissionApi(perm._id);
      fetchPermissions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete permission");
    }
  };

  // Resource ke hisaab se group karo — cleaner display ke liye
  const grouped = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {});

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Permissions</h1>
          <p className="text-sm text-gray-500">All permissions available in the system</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Permission</span>
        </Button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400 border border-gray-200 rounded-lg bg-white">
          No permissions found
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([resource, perms]) => (
              <div key={resource} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-900 capitalize">{resource.replace(/_/g, " ")}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {perms.map((p) => (
                    <div
                      key={p._id}
                      className="group flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-md border border-gray-200 hover:border-gray-300 transition"
                    >
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${ACTION_COLORS[p.action] || "bg-gray-100 text-gray-700"}`}>
                        {p.action}
                      </span>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-gray-300 hover:text-red-600 text-xs px-1 opacity-0 group-hover:opacity-100 transition"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Permission">
        <PermissionForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}