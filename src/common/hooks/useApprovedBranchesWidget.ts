import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApprovedBranches } from '@/api/queries/stores/branchesQueries';
import { ApprovedBranch } from '@/api/types/branchesApprovalTypes';

export const useApprovedBranchesWidget = () => {
  // Estado para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBranch, setSelectedBranch] = useState<ApprovedBranch | null>(null);
  const [refreshAnimation, setRefreshAnimation] = useState(false);

  // Consulta para obtener sucursales aprobadas
  const { data, isLoading, error, refetch } = useApprovedBranches();

  // Manejar el refrescar datos
  const handleRefresh = useCallback(async () => {
    setRefreshAnimation(true);
    await refetch();
    // Simular un pequeño retraso para que la animación sea visible
    setTimeout(() => setRefreshAnimation(false), 500);
  }, [refetch]);

  // Calcular datos filtrados y paginados
  const originalBranches = useMemo(() => data || [], [data]);

  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) return originalBranches;

    const term = searchTerm.toLowerCase().trim();
    return originalBranches.filter(branch => 
      branch.name?.toLowerCase().includes(term) || 
      branch.address?.toLowerCase().includes(term)
    );
  }, [originalBranches, searchTerm]);

  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredBranches.length / itemsPerPage)),
    [filteredBranches, itemsPerPage]
  );

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Ajustar página si la actual excede el total después de filtrar
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

  const handleViewDetails = useCallback((branch: ApprovedBranch) => {
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