import { useState, useEffect } from "react";
import api from "../lib/axios.js";

// Medicine aur uska corresponding Inventory item dono ek saath fetch karta hai
// Assumption: itemName Medicine.name se match karta hai (naming convention consistency)
export const useMedicineInventoryOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [medsRes, invRes] = await Promise.all([
          api.get("/medicines", { params: { status: "active" } }),
          api.get("/inventory", { params: { limit: 200 } }),
        ]);

        const medicines = medsRes.data.data;
        const inventoryItems = invRes.data.data.items;

        // Har medicine ko uske matching inventory item se jodo
        const merged = medicines
          .map((med) => {
            const invItem = inventoryItems.find(
              (inv) => inv.itemName.toLowerCase() === med.name.toLowerCase()
            );
            return invItem
              ? {
                  medicineId: med._id,
                  medicineName: med.name,
                  inventoryItemId: invItem._id,
                  availableStock: invItem.quantity,
                  price: med.price,
                }
              : null;
          })
          .filter(Boolean); // sirf woh medicines jinke paas stock record hai

        setOptions(merged);
      } catch (err) {
        console.error("Failed to load medicine options:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { options, loading };
};