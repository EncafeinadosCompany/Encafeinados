import { Dispatch, SetStateAction } from "react";
import { Branch } from "@/api/types/branches/branches.types";
import { SearchInput } from "@/common/atoms/search/search_input.atom";
import { ViewToggle } from "@/common/atoms/view/view_toggle.atom";
import { PaginationControls } from "@/common/atoms/pagination/pagination_controls.atom";
import { BranchCardsView } from "@/common/molecules/branch/branch_cards_view.molecule";
import { BranchTableView } from "@/common/molecules/branch/branch_table_view.molecule";
import { useBranchList } from "@/common/hooks/useBranchList.hook";
import { Coffee, MapPin, Plus } from "lucide-react";
import { Button } from "@/common/ui/button";
import { useNavigate } from "react-router-dom";


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

  const navigate = useNavigate();
  return (
    <div className="space-y-4 p-1">
      <div className="bg-gradient-to-r from-[#F5E4D2]/30 to-[#EAD7C1]/30 rounded-xl p-4 border border-[#E6D7C3]/30 backdrop-blur-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-[#DB8935]/10 p-2 rounded-lg flex-shrink-0">
              <Coffee className="h-5 w-5 text-[#DB8935]" />
            </div>
            <div className="min-w-0 flex-shrink-0">
              <h1 className="text-xl font-bold text-[#5F4B32] leading-tight truncate">{title}</h1>
              <div className="flex items-center gap-2 text-sm mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-[#DB8935]/70 flex-shrink-0" />
                <span className="text-[#8B5A2B]/80 truncate">
                  {isLoading ? "Cargando..." : `${totalBranches} sucursales`}
                </span>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg ml-4">
              <SearchInput
                value={searchTerm}
                onChange={handleSearch}
                placeholder={searchPlaceholder}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:flex-shrink-0">
            <Button
              onClick={() => navigate("/stores/register/branch")}
              className="bg-[#4ea171] hover:bg-green-700 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Registrar</span>
              <span className="hidden lg:inline">Sucursal</span>
            </Button>
            <ViewToggle
              currentView={viewMode}
              onViewChange={handleViewModeChange}
            />
          </div>
        </div>
      </div>

      <div className="min-h-[300px] bg-white/30 backdrop-blur-sm rounded-xl border border-[#E6D7C3]/20 overflow-hidden">
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

      {!isLoading && totalBranches > 0 && totalPages > 1 && (
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
