import { useState, useMemo, useCallback } from "react";
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

// Función de filtrado optimizada y memoizada
const createFilterFunction = (searchTerm: string) => {
  if (!searchTerm.trim()) return () => true;
  
  const searchLower = searchTerm.toLowerCase();
  return (branch: Branch) => {
    // Optimización: verificar campos más probables primero
    return (
      branch.name.toLowerCase().includes(searchLower) ||
      (branch.store?.store_name && branch.store.store_name.toLowerCase().includes(searchLower)) ||
      (branch.address && branch.address.toLowerCase().includes(searchLower)) ||
      (branch.phone_number && branch.phone_number.toLowerCase().includes(searchLower)) ||
      (branch.details && branch.details.toLowerCase().includes(searchLower))
    );
  };
};

// Función de ordenamiento optimizada
const createSortFunction = (sortField: SortField, sortDirection: SortDirection) => {
  return (a: Branch, b: Branch) => {
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
  };
};

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

  const safeBranches = useMemo(() => {
    return Array.isArray(branches) ? branches : [];
  }, [branches]);

  const filterFn = useMemo(() => createFilterFunction(searchTerm), [searchTerm]);
  const sortFn = useMemo(() => createSortFunction(sortField, sortDirection), [sortField, sortDirection]);

  const processedBranches = useMemo(() => {
    const filtered = safeBranches.filter(filterFn);
    const sorted = filtered.length > 0 ? [...filtered].sort(sortFn) : [];
    
    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = sorted.slice(startIndex, startIndex + pageSize);

    return {
      branches: paginated,
      totalBranches: totalItems,
      totalPages,
    };
  }, [safeBranches, filterFn, sortFn, currentPage, pageSize]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); 
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  }, [sortField, sortDirection]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return {
    branches: processedBranches.branches,
    totalBranches: processedBranches.totalBranches,
    totalPages: processedBranches.totalPages,

    searchTerm,
    currentPage,
    pageSize,
    viewMode,
    sortField,
    sortDirection,

    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleViewModeChange,
  };
};
