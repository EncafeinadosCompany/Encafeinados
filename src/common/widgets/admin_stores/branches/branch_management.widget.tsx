import { useState, useEffect } from "react";
import { PlusCircle, RefreshCw } from "lucide-react";
import { Button } from "@/common/ui/button";
import { Card, CardContent } from "@/common/ui/card";
import { BranchCard } from "@/common/molecules/admin_stores/branches/branch_card.molecule";

import { AnimatePresence } from "framer-motion";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger} from "@/common/ui/tooltip";
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

const EXPOSED_URL = import.meta.env.VITE_EXPOSED_URL;

export default function BranchManagement() {
  const [loading, setLoading] = useState(true);
  const [refreshAnimation, setRefreshAnimation] = useState(false);
  const storeId = localStorage.getItem("storeOrBranchId");

  const { data: branchesList } = useBranchByStore(Number(storeId));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isAssignAdminModalOpen, setIsAssignAdminModalOpen] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedQrCodeBranch, setSelectedQrCodeBranch] =
    useState<Branch | null>(null);
  const [selectedAdminBranch, setSelectedAdminBranch] = useState<Branch | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [BranchEdit, setBranchEdit] = useState<Branch | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (branchesList) {
      setLoading(false);
      const data = branchesList?.branches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredBranches(data);
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

  const handleRefresh = () => {
    setRefreshAnimation(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRefreshAnimation(false);
    }, 1000);
  };

  const handleEditClick = (card: Branch) => {
    setIsEditing(true);
    setBranchEdit(card);
    setIsAddModalOpen(true);
  };
  const handleQrCodeClick = (branch: Branch) => {
    setSelectedQrCodeBranch(branch);
    setIsQrCodeModalOpen(true);
  };

  const handleAssignAdminClick = (branch: Branch) => {
    setSelectedAdminBranch(branch);
    setIsAssignAdminModalOpen(true);
  };

  return (
    <Card className="border-none">
      <CardHeaderBranches length={filteredBranches?.length || 0} />
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <SearchBranches
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage}
          ></SearchBranches>

          <div className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    className="h-10 w-10 border-gray-200"
                    disabled={refreshAnimation}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        refreshAnimation ? "animate-spin" : ""
                      }`}
                    />
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 px-4 py-2"
            >
              <PlusCircle className="h-5 w-5 animate-pulse" />
              <span>Nueva Sucursal</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderSkeletons()}
          </div>
        ) : currentBranches.length === 0 ? (
          renderEmptyState({ searchQuery, setSearchQuery, setIsAddModalOpen })
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">            <AnimatePresence mode="popLayout">
              {currentBranches.map((branch, index) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  onViewDetails={() => viewBranchDetails(branch)}
                  onEdit={() => handleEditClick(branch)}
                  onGenerateQrCode={() => handleQrCodeClick(branch)}
                  onAssignAdmin={() => handleAssignAdminClick(branch)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
      {(filteredBranches?.length || 0) > itemsPerPage && (
        <CardFooterBranches
          filteredBranches={filteredBranches?.length || 0}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
        ></CardFooterBranches>
      )}
      {/* MODALS */}
      <AddBranchModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false), setIsEditing(false);
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
      )}      <QRCodeBranchModal
        isOpen={isQrCodeModalOpen}
        onClose={() => setIsQrCodeModalOpen(false)}
        qrCodeUrl={`${EXPOSED_URL}/coffeelover/register-branch-visit?branch_id=${selectedQrCodeBranch?.id}`}
      />

      <AssignBranchAdminModal
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
