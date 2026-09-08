import { useState, useEffect } from "react";
import { getDoctorsApi } from "../features/doctors/services/doctor.api.js";

export const useDoctorOptions = (departmentId) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getDoctorsApi({
          status: "active",
          departmentId: departmentId || undefined,
          limit: 100, // dropdown ke liye zyada items chahiye ho sakte hain
        });
        setDoctors(data.data?.doctors || []);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [departmentId]); // department badalne pe doctors refetch honge

  return { doctors, loading };
};