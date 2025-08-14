import { Dispatch, SetStateAction } from "react";
import { Branch } from "@/api/types/branches/branches.types";
import { SearchInput } from "@/common/atoms/search/search_input.atom";
import { ViewToggle } from "@/common/atoms/view/view_toggle.atom";
import { PaginationControls } from "@/common/atoms/pagination/pagination_controls.atom";
import { BranchCardsView } from "@/common/molecules/branch/branch_cards_view.molecule";
import { BranchTableView } from "@/common/molecules/branch/branch_table_view.molecule";
import { useBranchList } from "@/common/hooks/useBranchList.hook";

interface BranchListWidgetProps {
  branches: Branch[];
  isLoading?: boolean;
  onViewDetails?: (branch: Branch) => void;
  onAssingBranch?: (branch: Branch) => void;
  onVisit?: (branch: Branch) => void;
  onEdit?: (branch: Branch) => void;
  onQR?: Dispatch<SetStateAction<{ isOpen: boolean; code: number }>>;
  showActions?: boolean;
  title?: string;
  subtitle?: string;
  initialPageSize?: number;
  searchPlaceholder?: string;
}

export const BranchListWidget = ({
  branches,
  isLoading = false,
  onViewDetails,
  onAssingBranch,
  onEdit,
  onQR,
  onVisit,
  showActions = true,
  title = "Lista de Sucursales",
  subtitle,
  initialPageSize = 20,
  searchPlaceholder = "Buscar por nombre, dirección, teléfono...",
}: BranchListWidgetProps) => {
  const {
    branches: paginatedBranches,
    totalBranches,
    totalPages,
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
  } = useBranchList({ branches, initialPageSize });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
          <p className="text-sm text-gray-500 mt-1">
            {isLoading
              ? "Cargando..."
              : `${totalBranches} sucursales encontradas`}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
          />
        </div>

        <ViewToggle
          currentView={viewMode}
          onViewChange={handleViewModeChange}
        />
      </div>

      {/* Contenido */}
      <div className="min-h-[400px]">
        {viewMode === "card" ? (
          <BranchCardsView
            branches={paginatedBranches}
            onViewDetails={onViewDetails}
            onAssingBranch={onAssingBranch}
            onQr={onQR}
            onVisit={onVisit}
            showActions={showActions}
            isLoading={isLoading}
          />
        ) : (
          <BranchTableView
            branches={paginatedBranches}
            onViewDetails={onViewDetails}
            onAssingBranch={onAssingBranch}
            onVisit={onVisit}
            showActions={showActions}
            isLoading={isLoading}
            sortField={sortField}
            sortDirection={sortDirection}
            onQr={onQR}
            onSort={handleSort}
          />
        )}
      </div>

      {/* Paginación */}
      {!isLoading && totalBranches > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalBranches}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handlePageSizeChange}
          showItemsPerPage={true}
        />
      )}
    </div>
  );
};
