import { useState, useEffect } from "react";
import { getDepartmentsApi } from "../features/departments/services/department.api.js";

// Reusable — kahin bhi Department dropdown chahiye (Doctor form, Appointment form, etc.)
export const useDepartmentOptions = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getDepartmentsApi({ status: "active" });
        const list = Array.isArray(data.data)
          ? data.data
          : data.data?.departments || [];
        setDepartments(list);
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { departments, loading };
};