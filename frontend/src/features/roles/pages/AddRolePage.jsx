import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AddRoleModal from "../components/modals/AddRoleModal.jsx";
import { createRoleApi } from "../services/role.api.js";

export default function AddRolePage() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    await createRoleApi(formData);
    navigate("/roles");
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb Bar matching Screenshot */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Role</h1>
          <p className="text-xs text-slate-500 font-medium">
            Create a new custom role and set its permissions
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400">
          <Link to="/roles" className="hover:text-blue-600">
            Roles & Permissions
          </Link>
          <span>›</span>
          <span className="text-slate-900">Add Role</span>
        </div>
      </div>

      {/* Render full layout form */}
      <AddRoleModal
        isOpen={true}
        onClose={() => navigate("/roles")}
        onSubmit={handleCreate}
      />
    </div>
  );
}
