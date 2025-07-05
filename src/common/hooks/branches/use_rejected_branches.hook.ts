import { useState, useEffect, useMemo, useCallback } from 'react';
import { RejectedBranch } from '@/api/types/branches/branches_approval.types';
import { useRejectedBranches } from '@/api/queries/branches/branch.query';

export const useRejectedBranchesWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBranch, setSelectedBranch] = useState<RejectedBranch | null>(null);
  const [refreshAnimation, setRefreshAnimation] = useState(false);

  const { data, isLoading, error, refetch } = useRejectedBranches();

  const handleRefresh = useCallback(async () => {
    setRefreshAnimation(true);
    await refetch();
    setTimeout(() => setRefreshAnimation(false), 500);
  }, [refetch]);

  const originalBranches = useMemo(() => data || [], [data]);

  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) return originalBranches;

    const term = searchTerm.toLowerCase().trim();
    return originalBranches.filter(branch => 
      branch.name?.toLowerCase().includes(term) || 
      branch.address?.toLowerCase().includes(term) ||
      branch.rejection_reason?.toLowerCase().includes(term)
    );
  }, [originalBranches, searchTerm]);

  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredBranches.length / itemsPerPage)),
    [filteredBranches, itemsPerPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedBranches = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredBranches.slice(start, end);
  }, [filteredBranches, currentPage, itemsPerPage]);

  // Manejadores de eventos
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleViewDetails = useCallback((branch: RejectedBranch) => {
    setSelectedBranch(branch);
  }, []);

  return {
    // Datos
    isLoading,
    error,
    originalBranches,
    filteredBranches,
    paginatedBranches,
    totalPages,
    
    // Estado
    searchTerm,
    selectedBranch,
    refreshAnimation,
    currentPage,
    itemsPerPage,
    
    // Acciones
    setSearchTerm,
    setSelectedBranch,
    setItemsPerPage,
    handlePageChange,
    handleViewDetails,
    handleRefresh
  };
};
