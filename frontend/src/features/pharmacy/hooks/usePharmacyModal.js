import { useState, useCallback } from "react";

export function usePharmacyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openModal = useCallback((item = null) => {
    setSelectedItem(item);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
    setSubmitting(false);
  }, []);

  return {
    isOpen,
    selectedItem,
    submitting,
    setSubmitting,
    openModal,
    closeModal,
  };
}
