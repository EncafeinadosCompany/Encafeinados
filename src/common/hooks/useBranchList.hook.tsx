import { useState, useMemo } from "react";
import { Branch } from "@/api/types/branches/branches.types";
import { ViewMode } from "@/common/atoms/view/view_toggle.atom";
import {
  SortField,
  SortDirection,
} from "@/common/molecules/branch/branch_table_view.molecule";

interface UseBranchListProps {
  branches: Branch[] | null | undefined;
  initialPageSize?: number;
}

export const useBranchList = ({
  branches,
  initialPageSize = 20,
}: UseBranchListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Asegurar que branches sea siempre un array válido
  const safeBranches = useMemo(() => {
    return Array.isArray(branches) ? branches : [];
  }, [branches]);

  // Filtrar sucursales basado en la búsqueda
  const filteredBranches = useMemo(() => {
    if (!searchTerm) return safeBranches;

    const searchLower = searchTerm.toLowerCase();
    return safeBranches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchLower) ||
        branch.address?.toLowerCase().includes(searchLower) ||
        branch.phone_number?.toLowerCase().includes(searchLower) ||
        branch.store?.store_name?.toLowerCase().includes(searchLower) ||
        branch.details?.toLowerCase().includes(searchLower)
    );
  }, [safeBranches, searchTerm]);

  // Ordenar sucursales
  const sortedBranches = useMemo(() => {
    // Verificar que filteredBranches sea un array antes de intentar operaciones
    if (!Array.isArray(filteredBranches) || filteredBranches.length === 0) {
      return [];
    }

    const sorted = [...filteredBranches].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "average_rating":
          aValue = parseFloat(a.average_rating || "0");
          bValue = parseFloat(b.average_rating || "0");
          break;
        case "store_name":
          aValue = a.store?.store_name || "";
          bValue = b.store?.store_name || "";
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [filteredBranches, sortField, sortDirection]);

  // Calcular paginación
  const totalPages = Math.ceil((sortedBranches?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBranches = Array.isArray(sortedBranches)
    ? sortedBranches.slice(startIndex, startIndex + pageSize)
    : [];

  // Funciones de control
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset a la primera página cuando se busca
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset a la primera página cuando cambia el tamaño
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return {
    // Data
    branches: paginatedBranches,
    totalBranches: sortedBranches?.length || 0,
    totalPages,

    // State
    searchTerm,
    currentPage,
    pageSize,
    viewMode,
    sortField,
    sortDirection,

    // Handlers
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleViewModeChange,
  };
};
