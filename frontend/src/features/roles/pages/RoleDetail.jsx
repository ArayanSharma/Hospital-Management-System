import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Check } from "lucide-react";
import { getRoleByIdApi, updateRolePermissionsApi } from "../services/role.api.js";
import { getPermissionsApi } from "../../permissions/services/permission.api.js";
import Button from "../../../components/ui/Button.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

const ACTIONS = ["create", "read", "update", "delete"];

export default function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roleRes, permsRes] = await Promise.all([getRoleByIdApi(id), getPermissionsApi()]);
      setRole(roleRes.data.data);
      setAllPermissions(permsRes.data.data);
      setSelectedIds(new Set(roleRes.data.data.permissionIds.map((p) => p._id)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load role");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  // Permissions ko resource ke hisaab se group karo — matrix rows banane ke liye
  const groupedByResource = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = {};
    acc[perm.resource][perm.action] = perm;
    return acc;
  }, {});

  const togglePermission = (permId) => {
    const next = new Set(selectedIds);
    next.has(permId) ? next.delete(permId) : next.add(permId);
    setSelectedIds(next);
    setSaved(false);
  };

  const toggleEntireResource = (resourcePerms) => {
    const permIds = Object.values(resourcePerms).map((p) => p._id);
    const allSelected = permIds.every((pid) => selectedIds.has(pid));
    const next = new Set(selectedIds);
    permIds.forEach((pid) => (allSelected ? next.delete(pid) : next.add(pid)));
    setSelectedIds(next);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRolePermissionsApi(id, Array.from(selectedIds));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading role..." />;
  if (error) return <ErrorState message={error} />;
  if (!role) return null;

  const isLocked = role.isSystemRole;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /> Back to roles
      </button>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">{role.name}</h1>
            {isLocked && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3" /> System role
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{role.description || "No description"}</p>
        </div>

        {!isLocked && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : saved ? (
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Saved</span>
            ) : (
              "Save Changes"
            )}
          </Button>
        )}
      </div>

      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-md px-4 py-2.5">
          This is a system role. Its permissions cannot be modified.
        </div>
      )}

      {/* Permission matrix */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Resource</th>
              {ACTIONS.map((action) => (
                <th key={action} className="text-center px-4 py-3 font-medium text-gray-600 capitalize w-24">
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByResource).map(([resource, actions]) => (
              <tr key={resource} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <button
                    disabled={isLocked}
                    onClick={() => toggleEntireResource(actions)}
                    className="text-gray-800 font-medium capitalize hover:text-indigo-600 disabled:hover:text-gray-800 disabled:cursor-default"
                  >
                    {resource.replace(/_/g, " ")}
                  </button>
                </td>
                {ACTIONS.map((action) => {
                  const perm = actions[action];
                  if (!perm) return <td key={action} className="text-center px-4 py-3 text-gray-300">—</td>;

                  const checked = selectedIds.has(perm._id);
                  return (
                    <td key={action} className="text-center px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isLocked}
                        onChange={() => togglePermission(perm._id)}
                        className="w-4 h-4 accent-indigo-600 disabled:opacity-40 cursor-pointer disabled:cursor-default"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}