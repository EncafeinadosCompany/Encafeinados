import { memo } from "react";
import { Branch } from "@/api/types/branches/branches.types";
import { BranchCard } from "@/common/atoms/branch/branch_card.atom";
import { Dispatch, SetStateAction } from "react";

interface BranchCardsViewProps {
  branches: Branch[];
  onViewDetails?: (branch: Branch) => void;
  onAssingBranch?: (branch: Branch) => void;
  onQr?: Dispatch<SetStateAction<{ isOpen: boolean; code: number }>>;
  onVisit?: (branch: Branch) => void;
  showActions?: boolean;
  isLoading?: boolean;
}

// Componente de skeleton optimizado
const SkeletonCard = memo(() => (
  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl animate-pulse border border-gray-100" />
));

// Componente principal memoizado para evitar re-renders innecesarios
export const BranchCardsView = memo<BranchCardsViewProps>(({
  branches,
  onViewDetails,
  onAssingBranch,
  onQr,
  onVisit,
  showActions = true,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 text-lg font-medium mb-2">
          No se encontraron sucursales
        </div>
        <p className="text-gray-500 text-sm">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 p-4">
      {branches.map((branch) => (
        <div key={branch.id} className="h-full">
          <BranchCard
            branch={branch}
            onViewDetails={onViewDetails}
            onAssingBranch={onAssingBranch}
            onQr={onQr}
            onVisit={onVisit}
            showActions={showActions}
          />
        </div>
      ))}
    </div>
  );
});

BranchCardsView.displayName = "BranchCardsView";
