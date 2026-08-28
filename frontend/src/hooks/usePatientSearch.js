import { useState, useEffect } from "react";
import { getPatientsApi } from "../features/patients/services/patient.api.js";
import { useDebounce } from "./useDebounce.js";

export const usePatientSearch = (searchTerm) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setPatients([]);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getPatientsApi({ search: debouncedSearch, limit: 10 });
        setPatients(data.data?.patients || []);
      } catch (err) {
        console.error("Failed to search patients:", err);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [debouncedSearch]);

  return { patients, loading };
};