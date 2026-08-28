import { useState, useEffect } from "react";
import api from "../lib/axios.js";

export const useSupplierOptions = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/suppliers", { params: { status: "active" } });
        setSuppliers(data.data);
      } catch (err) {
        console.error("Failed to load suppliers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { suppliers, loading };
};