import { useState, useEffect } from "react";
import { getPatientsApi } from "../features/patients/services/patient.api.js";
import { useDebounce } from "./useDebounce.js";

export const usePatientSearch = (searchTerm) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const { data } = await getPatientsApi({ search: debouncedSearch || "", limit: 15 });
        const fetched = data?.data?.patients || data?.patients || [];
        setPatients(fetched);
      } catch (err) {
        console.error("Failed to search patients:", err);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [debouncedSearch]);

  return { patients, loading };
};