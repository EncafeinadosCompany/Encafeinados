import React, { useState } from "react";
import { Card,  CardHeader, CardTitle, CardFooter } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Skeleton } from "@/common/ui/skeleton";
import { Coffee, RefreshCw, Search, AlertTriangle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip";

import { StatusBadge } from "@/common/atoms/StatusBadge";
import { BranchSearchBar } from "@/common/molecules/admin/branch/branch_search_bar.molecule";
import { BranchPagination } from "@/common/molecules/admin/branch/branch_pagination.molecule";
import { BranchCard } from "@/common/molecules/admin/branch/branch_card.molecule";
import { BranchApprovalDialog } from "@/common/molecules/admin/branch/branch_approval_dialog.molecule";
import { BranchApproveDialog } from "@/common/molecules/admin/branch/branch_approve_dialog.molecule";
import { BranchRejectDialog } from "@/common/molecules/admin/branch/branch_reject_dialog.molecule";
import { usePendingBranchesWidget } from "@/common/hooks/branches/usePendingBranchesWidget";
import { BranchApprovalDetails } from '@/api/types/branches/branches_approval.types';

import { useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { useApproveBranchMutation, useRejectBranchMutation } from "@/api/mutations/branches/branch_states.mutation";


export const PendingBranchesWidget = () => {
  const checkUserAuth = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('No se detecta una sesión activa. Por favor, inicia sesión nuevamente.');
      return false;
    }
    return true;
  };

  const {
    data = [],
    isLoading,
    error,
    refetch,
    filteredBranches,
    paginatedBranches,
    totalPages,
    
    searchTerm,
    selectedBranch,
    confirmationDialog,
    refreshAnimation,
    currentPage,
    itemsPerPage,
    detailsDialogOpen,
    setDetailsDialogOpen,
    
    // Actions
    setSearchTerm,
    setSelectedBranch,
    setItemsPerPage,
    handlePageChange,
    handleApprove,
    handleReject,
    handleViewDetails,
    handleRefresh,
  } = usePendingBranchesWidget();

  const queryClient = useQueryClient();
  
  const approveBranchMutation = useApproveBranchMutation();
  const rejectBranchMutation = useRejectBranchMutation();
  
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBranchForAction, setSelectedBranchForAction] = useState<number | null>(null);
  
  const openApproveDialog = (branchId: number) => {
    setSelectedBranchForAction(branchId);
    setIsApproveDialogOpen(true);
  };
  
  const openRejectDialog = (branchId: number) => {
    setSelectedBranchForAction(branchId);
    setIsRejectDialogOpen(true);
  };
  
  const confirmApprove = (branchId: number) => {
    if (!checkUserAuth()) return;
    
    setIsSubmitting(true);
    
    const branchDetails = queryClient.getQueryData<BranchApprovalDetails>(
      ['branch-approvals', 'detail', branchId]
    );
    
    if (!branchDetails?.approvalId) {
      toast.error("No se encontró la información necesaria para aprobar");
      setIsSubmitting(false);
      setIsApproveDialogOpen(false);
      return;
    }
    
    approveBranchMutation.mutate(branchDetails.approvalId, {
      onSuccess: () => {
        toast.success("Sucursal aprobada correctamente");
        setIsSubmitting(false);
        setIsApproveDialogOpen(false);
        refetch();
        setDetailsDialogOpen(false);
      },
      onError: (error) => {
        toast.error(`Error al aprobar la sucursal: ${error.message}`);
        setIsSubmitting(false);
      }
    });
  };
  
  const confirmReject = (branchId: number, reason: string) => {
    if (!checkUserAuth()) return;
    
    setIsSubmitting(true);
    
    const branchDetails = queryClient.getQueryData<BranchApprovalDetails>(
      ['branch-approvals', 'detail', branchId]
    );
    
    if (!branchDetails?.approvalId) {
      toast.error("No se encontró la información necesaria para rechazar");
      setIsSubmitting(false);
      setIsRejectDialogOpen(false);
      return;
    }
    
    rejectBranchMutation.mutate(
      { 
        approvalId: branchDetails.approvalId, 
        reason 
      },
      {
        onSuccess: () => {
          toast.success("Sucursal rechazada correctamente");
          setIsSubmitting(false);
          setIsRejectDialogOpen(false);
          refetch();
          setDetailsDialogOpen(false);
        },
        onError: (error) => {
          toast.error(`Error al rechazar la sucursal: ${error.message}`);
          setIsSubmitting(false);
        }
      }
    );
  };
  
  const getBranchName = (branchId: number | null) => {
    if (!branchId) return undefined;
    const branch = data.find(b => b.id === branchId);
    return branch?.name;
  };

  const renderEmptyState = () => {
    const originalBranches = filteredBranches.length === 0 && searchTerm 
      ? data || []
      : [];
    
    if (originalBranches.length > 0 && searchTerm) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-gray-400">
          <Search className="h-10 w-10 text-gray-300 mb-2 stroke-[1.5px]" />
          <p className="font-medium text-sm text-gray-500">No se encontraron resultados</p>
          <p className="text-xs mt-1 max-w-xs text-center px-4">
            No hay sucursales que coincidan con "{searchTerm}"
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSearchTerm("")}
            className="mt-3 border-gray-300 text-gray-500 hover:bg-gray-50 h-7 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Limpiar búsqueda
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-6 text-gray-400">
        <Coffee className="h-10 w-10 text-[#D4A76A]/60 mb-2" />
        <p className="font-medium text-sm text-[#6F4E37]">No hay sucursales pendientes</p>
        <p className="text-xs mt-1 max-w-xs text-center px-4">
          Todas las solicitudes han sido procesadas
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          className="mt-3 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A]/10 h-7 text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${refreshAnimation ? 'animate-spin' : ''}`} />
          Verificar
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-3 space-y-3 w-full flex-grow flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-6 rounded-full" />
          </div>
          
          <Skeleton className="h-6 w-full mb-2" />
          
          <div className="space-y-2">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="rounded-md border p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-red-500 flex-grow">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p className="font-medium text-sm">Error al cargar</p>
          <Button 
            variant="outline"
            className="mt-2 border-red-200 text-xs py-1 h-7"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        </div>
      );
    }
    
    return (
      <>
        <div className="flex-grow relative h-0 min-h-0 w-full">
          <div 
            className="absolute inset-0 overflow-y-auto py-1 px-1 pending-scroll-area"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#F3D19E transparent'
            }}
          >
            {filteredBranches.length === 0 ? (
              renderEmptyState()
            ) : (
              <AnimatePresence mode="popLayout">
                {paginatedBranches.map((branch, index) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    index={index}
                    onView={handleViewDetails}
                    onApprove={() => openApproveDialog(branch.id)}
                    onReject={() => openRejectDialog(branch.id)}
                    type="pending"
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
        
        <CardFooter className="p-0 w-full flex-shrink-0">
          <BranchPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBranches.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardFooter>
      </>
    );
  };

  return (
    <>
      <Card className="w-full h-full shadow-sm border-gray-200 overflow-hidden flex flex-col">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50/80 py-2 px-3 flex justify-between items-center flex-shrink-0 ">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <CardTitle className="text-sm font-medium text-gray-700">Sucursales Pendientes</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge count={filteredBranches.length} status="pending" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleRefresh}
                    className="h-6 w-6 rounded-full text-gray-500 hover:bg-amber-50/80 hover:text-amber-700"
                    disabled={refreshAnimation}
                  >
                    <RefreshCw className={`h-3 w-3 ${refreshAnimation ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium bg-amber-50 text-amber-700 border-amber-200 no-arrow">
                  Actualizar lista
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        
        <div className="flex-shrink-0 p-2">
          <BranchSearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        
        <div className="flex-grow flex flex-col min-h-0 w-full overflow-hidden">
          {renderContent()}
        </div>
      <BranchApprovalDialog
        branchId={selectedBranch?.id || null}
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        onApprove={openApproveDialog}
        onReject={openRejectDialog}
      />
      
      <BranchApproveDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onConfirm={confirmApprove}
        branchId={selectedBranchForAction}
        branchName={getBranchName(selectedBranchForAction)}
        isSubmitting={isSubmitting}
      />
      
      <BranchRejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={confirmReject}
        branchId={selectedBranchForAction}
        branchName={getBranchName(selectedBranchForAction)}
        isSubmitting={isSubmitting}
      />
      </Card>
      
    </>
  );
};