import { useState, useEffect } from "react";
import { PlusCircle, RefreshCw }  from "@/common/ui/icons"
import { Button } from "@/common/ui/button";
import { Card, CardContent } from "@/common/ui/card";
import { BranchCard } from "@/common/molecules/admin_stores/branches/branch_card.molecule";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip";
import { useBranchByStore } from "@/api/queries/stores/stores.query";
import { Branch } from "@/api/types/branches/branches.types";
import { renderSkeletons } from "@/common/molecules/admin_stores/branches/render_skeletons.molecule";
import { renderEmptyState } from "@/common/molecules/admin_stores/branches/render_emty_state.molecule";
import { AddBranchModal } from "@/common/molecules/admin_stores/branches/create_branches.molecule";
import { BranchDetails } from "@/common/molecules/admin_stores/branches/branch_details.molecule";
import { SearchBranches } from "@/common/molecules/admin_stores/branches/search_branches.molecule";
import { CardFooterBranches } from "@/common/molecules/admin_stores/branches/card_footer_branches.molecule";
import { CardHeaderBranches } from "@/common/molecules/admin_stores/branches/card_header_branches.molecule";
import { QRCodeBranchModal } from "@/common/molecules/admin_stores/branches/qr_code_branches_modal.molecule";
import { AssignBranchAdminModal } from "@/common/molecules/admin_stores/branches/assign_branch_admin_modal.molecule";

import { Badge } from "@/common/ui/badge";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

const EXPOSED_URL = import.meta.env.VITE_EXPOSED_URL;

export default function BranchManagement() {
  const [loading, setLoading] = useState(true);
  const [refreshAnimation, setRefreshAnimation] = useState(false);
  const storeId = getEncryptedItem("storeId") as string | null;

  const { data: branchesList, refetch, isRefetching } = useBranchByStore(Number(storeId));  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);  const [isAssignAdminModalOpen, setIsAssignAdminModalOpen] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedQrCodeBranch, setSelectedQrCodeBranch] = useState<Branch | null>(null);
  const [selectedAdminBranch, setSelectedAdminBranch] = useState<Branch | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [BranchEdit, setBranchEdit] = useState<Branch | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  useEffect(() => {
    if (branchesList && branchesList.branches && Array.isArray(branchesList.branches)) {
      setLoading(false);
      const data = branchesList.branches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredBranches(data);
    } else {
      setFilteredBranches([]);
    }
  }, [branchesList, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBranches =
    filteredBranches?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((filteredBranches?.length || 0) / itemsPerPage);

  const viewBranchDetails = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsFormDialogOpen(true);
  };

  const closeDetails = () => {
    setSelectedBranch(null);
  };

  const handleRefresh = async () => {
    setRefreshAnimation(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => {
        setRefreshAnimation(false);
      }, 600);
    }
  };

  const handleEditClick = (card: Branch) => {
    setIsEditing(true);
    setBranchEdit(card);
    setIsAddModalOpen(true);
  };
  
  const handleQrCodeClick = (branch: Branch) => {
    setSelectedQrCodeBranch(branch);
    setIsQrCodeModalOpen(true);
  };  const handleAssignAdminClick = (branch: Branch) => {
    setSelectedAdminBranch(branch);
    setIsAssignAdminModalOpen(true);
  };

  return (
    <Card className="border-none ">
      <CardHeaderBranches length={filteredBranches?.length || 0} />
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-1">
          <div className="relative flex-grow">
            <SearchBranches
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setCurrentPage={setCurrentPage}
            />
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2"
              >
                <Badge 
                  variant="outline" 
                  className="bg-[#F8F4F0] text-[#8B5A2B] border-[#E6D7C3] flex items-center gap-1"
                >
                  <span>Buscando: {searchQuery}</span>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="ml-1 h-4 w-4 rounded-full hover:bg-[#E6D7C3]/50 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </Badge>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    className={`h-10 w-10 border-gray-200 relative ${
                      refreshAnimation || isRefetching 
                        ? "cursor-not-allowed" 
                        : "hover:bg-[#F8F4F0] hover:text-[#DB8935] hover:border-[#E6D7C3] transition-colors"
                    }`}
                    disabled={refreshAnimation || isRefetching}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        refreshAnimation || isRefetching ? "animate-spin text-[#DB8935]" : ""
                      }`}
                    />
                    {(refreshAnimation || isRefetching) && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DB8935]/20 opacity-75" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="text-xs font-medium bg-gray-800 text-gray-100 border-gray-700"
                >
                  Actualizar
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 ease-out group-hover:w-full"></div>
              <PlusCircle className="h-5 w-5 animate-pulse" />
              <span>Nueva Sucursal</span>
            </Button>
          </div>
        </div>

        {filteredBranches.length > 0 && (
          <div className="text-xs text-gray-500 mb-4">
            Mostrando {filteredBranches.length} sucursales
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderSkeletons()}
          </div>
        ) : filteredBranches.length === 0 ? (
          renderEmptyState({ searchQuery, setSearchQuery, setIsAddModalOpen })
        ) : (
          <div className="max-h-[70vh] overflow-y-auto pr-2 pb-2 custom-scrollbar">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >            
              <AnimatePresence mode="popLayout">
                {filteredBranches.map((branch, index) => (
                  <motion.div
                    key={branch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: hoveredCardId === branch.id ? 1.02 : 1,
                      transition: { 
                        delay: index * 0.05,
                        duration: 0.3
                      }
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    onHoverStart={() => setHoveredCardId(branch.id)}
                    onHoverEnd={() => setHoveredCardId(null)}
                  >
                    <BranchCard
                      branch={branch}
                      onViewDetails={() => viewBranchDetails(branch)}
                      onEdit={() => handleEditClick(branch)}
                      onGenerateQrCode={() => handleQrCodeClick(branch)}
                      onAssignAdmin={() => handleAssignAdminClick(branch)}
                      index={index}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </CardContent>
      
      {(filteredBranches?.length || 0) > itemsPerPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CardFooterBranches
            filteredBranches={filteredBranches?.length || 0}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
          />
        </motion.div>
      )}

      {/* MODALS */}
      <AddBranchModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditing(false);
        }}
        initialData={isEditing ? BranchEdit : null}
        mode={isEditing ? "edit" : "add"}
      />

      {selectedBranch && (
        <BranchDetails
          branch={selectedBranch}
          isOpen={!!selectedBranch}
          onClose={closeDetails}
        />
      )}      
      
      <QRCodeBranchModal
        isOpen={isQrCodeModalOpen}
        onClose={() => setIsQrCodeModalOpen(false)}
        qrCodeUrl={`${EXPOSED_URL}/coffeelover/register-branch-visit?branch_id=${selectedQrCodeBranch?.id}`}
      />      <AssignBranchAdminModal
        isOpen={isAssignAdminModalOpen}
        onClose={() => {
          setIsAssignAdminModalOpen(false);
          setSelectedAdminBranch(null);
        }}
        branch={selectedAdminBranch}
      />
    </Card>
  );
}
