import { useState, useMemo, useCallback } from "react";

export function usePharmacyFilter({
  initialData = [],
  filterFields = {},
  defaultTab = "all",
  itemsPerPage: defaultItemsPerPage = 10,
} = {}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(filterFields);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setFilters(filterFields);
    setActiveTab(defaultTab);
    setCurrentPage(1);
  }, [filterFields, defaultTab]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  };
}
