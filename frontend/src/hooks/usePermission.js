import { useSelector } from "react-redux";

export const usePermission = () => {
  const { user } = useSelector((state) => state.auth);

  const hasPermission = (permissionName) => {
    if (!permissionName) return true; // null permission = visible for everyone
    const roleName = (user?.roleId?.name || user?.role?.name || user?.role || "").toUpperCase();
    if (roleName === "SUPER_ADMIN" || roleName === "SUPERADMIN" || roleName === "ADMIN") return true;

    const permissions = user?.roleId?.permissionIds || user?.permissions || [];
    if (!Array.isArray(permissions) || permissions.length === 0) return false;

    return permissions.some((p) => {
      if (typeof p === "string") return p === permissionName;
      return p?.name === permissionName;
    });
  };

  return { hasPermission };
};