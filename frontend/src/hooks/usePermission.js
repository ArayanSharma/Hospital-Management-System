import { useSelector } from "react-redux";

export const usePermission = () => {
  const { user } = useSelector((state) => state.auth);

  const hasPermission = (permissionName) => {
    if (!permissionName) return true; // null permission = sabke liye visible
    if (!user?.roleId?.permissionIds) return false;

    return user.roleId.permissionIds.some((p) => p.name === permissionName);
  };

  return { hasPermission };
};