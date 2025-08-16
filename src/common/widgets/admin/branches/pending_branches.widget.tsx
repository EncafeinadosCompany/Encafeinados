import React, { useState } from "react";
import { Card,  CardHeader, CardTitle, CardFooter } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Skeleton } from "@/common/ui/skeleton";
import { Coffee, RefreshCw, Search, AlertTriangle }  from "@/common/ui/icons"
import { AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip";

import { StatusBadge } from "@/common/atoms/common/status_badge.atom";
import { BranchSearchBar } from "@/common/molecules/admin/branch/branch_search_bar.molecule";
import { BranchPagination } from "@/common/molecules/admin/branch/branch_pagination.molecule";
import { BranchCard } from "@/common/molecules/admin/branch/branch_card.molecule";
import { BranchApprovalDialog } from "@/common/molecules/admin/branch/branch_approval_dialog.molecule";
import { BranchApproveDialog } from "@/common/molecules/admin/branch/branch_approve_dialog.molecule";
import { BranchRejectDialog } from "@/common/molecules/admin/branch/branch_reject_dialog.molecule";
import { usePendingBranchesWidget } from "@/common/hooks/branches/use_pending_branches.hook";
import { BranchApprovalDetails } from '@/api/types/branches/branches_approval.types';
import { useBranchApprovalDetails } from '@/api/queries/branches/branch.query';

import { useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { useApproveBranchMutation, useRejectBranchMutation } from "@/api/mutations/branches/branch_states.mutation";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";


export const PendingBranchesWidget = () => {
  const checkUserAuth = () => {
    const userId =  getEncryptedItem('userId');
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
    const confirmApprove = async (branchId: number) => {
    if (!checkUserAuth()) return;
    
    setIsSubmitting(true);
    
    try {
      let branchDetails = queryClient.getQueryData<BranchApprovalDetails>(
        ['branch-approvals', 'detail', branchId]
      );
      
      if (!branchDetails?.approvalId) {
        console.log("Obteniendo detalles de la sucursal desde la API...");
        const response = await queryClient.fetchQuery({
          queryKey: ['branch-approvals', 'detail', branchId],
          queryFn: async () => {
            const authClient = new (await import("@/api/client/axios")).default();
            return authClient.get<BranchApprovalDetails>(`/branch-approvals/detail/${branchId}`);
          }
        });
        branchDetails = response;
      }
      
      if (!branchDetails?.approvalId) {
        toast.error("No se encontró la información necesaria para aprobar");
        setIsSubmitting(false);
        setIsApproveDialogOpen(false);
        return;
      }

      console.log("Aprobando sucursal con approvalId:", branchDetails.approvalId);
      
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
    } catch (error) {
      console.error("Error obteniendo detalles de la sucursal:", error);
      toast.error("Error obteniendo información de la sucursal");
      setIsSubmitting(false);
      setIsApproveDialogOpen(false);
    }
  };
    const confirmReject = async (branchId: number, reason: string) => {
    if (!checkUserAuth()) return;
    
    setIsSubmitting(true);
    
    try {
      let branchDetails = queryClient.getQueryData<BranchApprovalDetails>(
        ['branch-approvals', 'detail', branchId]
      );
      
      if (!branchDetails?.approvalId) {
        console.log("Obteniendo detalles de la sucursal desde la API...");
        const response = await queryClient.fetchQuery({
          queryKey: ['branch-approvals', 'detail', branchId],
          queryFn: async () => {
            const authClient = new (await import("@/api/client/axios")).default();
            return authClient.get<BranchApprovalDetails>(`/branch-approvals/detail/${branchId}`);
          }
        });
        branchDetails = response;
      }
      
      if (!branchDetails?.approvalId) {
        toast.error("No se encontró la información necesaria para rechazar");
        setIsSubmitting(false);
        setIsRejectDialogOpen(false);
        return;
      }
      
      console.log("Rechazando sucursal con approvalId:", branchDetails.approvalId);
      
      rejectBranchMutation.mutate(
        { 
          approvalId: branchDetails.approvalId, 
          reason: reason || "Sin motivo especificado"
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
    } catch (error) {
      console.error("Error obteniendo detalles de la sucursal:", error);
      toast.error("Error obteniendo información de la sucursal");
      setIsSubmitting(false);
      setIsRejectDialogOpen(false);
    }
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
        <div className="flex flex-col items-center justify-center py-8 px-6">
          <div className="bg-[#F5E4D2]/30 p-3 rounded-xl mb-4">
            <Search className="h-6 w-6 text-[#DB8935]/70" />
          </div>
          <h3 className="font-medium text-[#5F4B32] mb-2">Sin resultados</h3>
          <p className="text-sm text-[#8B5A2B]/70 text-center max-w-xs mb-4">
            No hay sucursales que coincidan con <span className="font-medium text-[#6F4E37]">"{searchTerm}"</span>
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSearchTerm("")}
            className="bg-white border-[#E6D7C3] text-[#8B5A2B] hover:bg-[#F5E4D2]/20 hover:border-[#DB8935]/50 text-xs h-8 px-3"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Limpiar búsqueda
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-8 px-6">
        <div className="bg-[#F5E4D2]/30 p-4 rounded-xl mb-4">
          <Coffee className="h-8 w-8 text-[#DB8935]/70" />
        </div>
        <h3 className="font-semibold text-[#5F4B32] mb-2">Todo al día</h3>
        <p className="text-sm text-[#8B5A2B]/70 text-center max-w-sm mb-4">
          No hay solicitudes pendientes. Todas las sucursales han sido procesadas.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          className="bg-white border-[#E6D7C3] text-[#8B5A2B] hover:bg-[#F5E4D2]/20 hover:border-[#DB8935]/50 text-xs h-8 px-3"
        >
          <RefreshCw className={`h-3 w-3 mr-1.5 ${refreshAnimation ? 'animate-spin' : ''}`} />
          Verificar
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-3 w-full flex-grow flex flex-col justify-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#F5E4D2]/30 p-3 rounded-xl">
              <Coffee className="h-6 w-6 text-[#DB8935] animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="rounded-xl border border-[#E6D7C3]/30 p-3 bg-white/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg bg-[#F5E4D2]/40" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-28 bg-[#F5E4D2]/40" />
                      <Skeleton className="h-2.5 w-20 bg-[#F5E4D2]/30" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-18 rounded-md bg-[#F5E4D2]/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-6 flex-grow">
          <div className="bg-red-50 p-3 rounded-xl mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="font-medium text-red-600 mb-2">Error al cargar</h3>
          <p className="text-sm text-red-500/70 text-center max-w-xs mb-4">
            No se pudieron obtener las sucursales
          </p>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs h-8 px-3"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
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
      <Card className="w-full h-full shadow-lg border border-[#E6D7C3]/40 bg-[#FBF7F4] overflow-hidden flex flex-col">
        <CardHeader className="bg-gradient-to-r from-[#F5E4D2]/60 to-[#EAD7C1]/60 py-3 px-4 flex justify-between items-center flex-shrink-0 border-b border-[#E6D7C3]/30">
          <div className="flex items-center space-x-3">
            <div className="bg-[#DB8935]/10 p-2 rounded-full">
              <Coffee className="h-4 w-4 text-[#DB8935]" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-[#5F4B32]">
                Sucursales Pendientes
              </CardTitle>
              <p className="text-xs text-[#8B5A2B]/70 mt-0.5">
                Gestionar solicitudes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <StatusBadge count={filteredBranches.length} status="pending" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleRefresh}
                    className="h-8 w-8 rounded-lg bg-white/70 hover:bg-white text-[#8B5A2B] hover:text-[#6F4E37] border border-[#E6D7C3]/50 hover:border-[#DB8935]/30 transition-all duration-200"
                    disabled={refreshAnimation}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${refreshAnimation ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium bg-[#FBF7F4] text-[#5F4B32] border-[#E6D7C3] shadow-sm">
                  Actualizar lista
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        
        <div className="flex-shrink-0 p-3 bg-white/40">
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