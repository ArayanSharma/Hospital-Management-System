import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import EditPermissionsModal from "../components/modals/EditPermissionsModal.jsx";
import { getRoleByIdApi, updateRoleApi } from "../services/role.api.js";

export default function EditPermissionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data } = await getRoleByIdApi(id);
        setRole(data?.data || data);
      } catch (err) {
        console.error("Error fetching role:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id]);

  const handleUpdate = async (roleId, actionPermissions) => {
    await updateRoleApi(roleId, { actionPermissions });
    navigate("/roles");
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-bold text-slate-500">
        Loading role permissions from database...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb Bar matching Screenshot */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Role Permissions</h1>
          <p className="text-xs text-slate-500 font-medium">
            Update permissions for the role: {role?.name || "DOCTOR"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400">
          <Link to="/roles" className="hover:text-blue-600">
            Roles & Permissions
          </Link>
          <span>›</span>
          <span>Roles</span>
          <span>›</span>
          <span className="text-slate-900">Edit Permissions</span>
        </div>
      </div>

      <EditPermissionsModal
        isOpen={true}
        onClose={() => navigate("/roles")}
        onSubmit={handleUpdate}
        role={role}
      />
    </div>
  );
}
