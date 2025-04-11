import { useState, useEffect, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Store } from "@/api/types/storesTypes";
import { useApprovedStores } from "@/api/queries/stores/storesQueries";

export const useApprovedStoresWidget = () => {
  // API data
  const { data, isLoading, error } = useApprovedStores();
  const queryClient = useQueryClient();
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [refreshAnimation, setRefreshAnimation] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Derived state
  const originalStores = useMemo(() => {
    return Array.isArray(data?.stores) ? data?.stores : data?.stores?.stores || [];
  }, [data]);
  
  const filteredStores = useMemo(() => {
    if (!searchTerm) return originalStores;
    
    const term = searchTerm.toLowerCase();
    return originalStores.filter((store: Store) => 
      store.name?.toLowerCase().includes(term) || 
      store.email?.toLowerCase().includes(term)
    );
  }, [originalStores, searchTerm]);

  const paginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredStores.slice(startIndex, endIndex);
  }, [filteredStores, currentPage, itemsPerPage]);
  
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredStores.length / itemsPerPage));
  }, [filteredStores, itemsPerPage]);
  
  // Reset to first page when search or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);
  
  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollContainer = document.querySelector('.approved-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };
  
  const handleViewDetails = (store: Store) => {
    setSelectedStore(store);
  };

  const handleRefresh = () => {
    setRefreshAnimation(true);
    queryClient.invalidateQueries({ queryKey: ["stores", "approved"] });
    
    setTimeout(() => {
      setRefreshAnimation(false);
    }, 1000);
  };

  return {
    // Data
    data,
    isLoading,
    error,
    originalStores,
    filteredStores,
    paginatedStores,
    totalPages,
    
    // State
    searchTerm,
    selectedStore,
    refreshAnimation,
    currentPage,
    itemsPerPage,
    
    // Actions
    setSearchTerm,
    setSelectedStore,
    setItemsPerPage,
    handlePageChange,
    handleViewDetails,
    handleRefresh
  };
};