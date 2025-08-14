import { motion } from "framer-motion";
import { Branch } from "@/api/types/branches/branches.types";
import { BranchCard } from "@/common/atoms/branch/branch_card.atom";
import { Dispatch, SetStateAction } from "react";

interface BranchCardsViewProps {
  branches: Branch[];
  onViewDetails?: (branch: Branch) => void;
  onEdit?: (branch: Branch) => void;
  onQr?: Dispatch<SetStateAction<{ isOpen: boolean; code: number }>>;
  onVisit?: (branch: Branch) => void;
  showActions?: boolean;
  isLoading?: boolean;
}

export const BranchCardsView = ({
  branches,
  onViewDetails,
  onEdit,
  onQr,
  onVisit,
  showActions = true,
  isLoading = false,
}: BranchCardsViewProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-64 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">
          No se encontraron sucursales
        </div>
        <p className="text-gray-400 text-sm">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {branches.map((branch, index) => (
        <motion.div
          key={branch.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="h-full"
        >
          <BranchCard
            branch={branch}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onQr={onQr}
            onVisit={onVisit}
            showActions={showActions}
          />
        </motion.div>
      ))}
    </div>
  );
};
