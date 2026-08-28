import { useState, useEffect } from "react";
import { getRolesApi } from "../features/roles/services/role.api.js";

export const useRoleOptions = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getRolesApi();
        setRoles(data.data);
      } catch (err) {
        console.error("Failed to load roles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { roles, loading };
};