import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Skeleton } from "@/common/ui/skeleton";
import { RefreshCw, Search, AlertTriangle, Coffee } from "@/common/ui/icons";
import { AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip";
import { ApprovedBranch, BranchApprovalDetails } from '@/api/types/branches/branches_approval.types';
import { StatusBadge } from "@/common/atoms/StatusBadge";
import { BranchSearchBar } from "@/common/molecules/admin/branch/branch_search_bar.molecule";
import { BranchPagination } from "@/common/molecules/admin/branch/branch_pagination.molecule";
import { BranchCard } from "@/common/molecules/admin/branch/branch_card.molecule";
import { BranchDetailsModal } from "@/common/molecules/admin/branch/branch_details_enhanced_modal.molecule";
import { BranchRejectDialog } from "@/common/molecules/admin/branch/branch_reject_dialog.molecule";
import { useApprovedBranchesWidget } from "@/common/hooks/branches/useApprovedBranchesWidget";
import { useReRejectBranchMutation } from "@/api/mutations/branches/branch_states.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { useBranchApprovalDetails } from "@/api/queries/branches/branch.query";
import AuthClient from "@/api/client/axios";
import toast from 'react-hot-toast';
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

export const ApprovedBranchesWidget = () => {
  const {
    // Data
    isLoading,
    error,
    originalBranches,
    filteredBranches,
    paginatedBranches,
    totalPages,
    
    // State
    searchTerm,
    selectedBranch,
    refreshAnimation,
    currentPage,
    itemsPerPage,
    
    // Actions
    setSearchTerm,
    setSelectedBranch,
    setItemsPerPage,
    handlePageChange,
    handleViewDetails,
    handleRefresh
  } = useApprovedBranchesWidget();

  const queryClient = useQueryClient();
  const authClient = new AuthClient();
  const reRejectMutation = useReRejectBranchMutation();
  
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBranchForAction, setSelectedBranchForAction] = useState<number | null>(null);

  const checkUserAuth = () => {
    const userId = getEncryptedItem('userId');
    if (!userId) {
      toast.error('No se detecta una sesión activa. Por favor, inicia sesión nuevamente.');
      return false;
    }
    return true;
  };

  const openRejectDialog = (branchId: number) => {
    setSelectedBranchForAction(branchId);
    setIsRejectDialogOpen(true);
  };
  const confirmReject = async (branchId: number, reason: string) => {
    if (!checkUserAuth()) return;
    
    setIsSubmitting(true);
    
    try {
      // Obtener detalles de la sucursal directamente usando el branchId correcto
      const branchDetails = await authClient.get<BranchApprovalDetails>(`/branch-approvals/detail/${branchId}`);
      
      if (!branchDetails?.approvalId) {
        toast.error("No se encontró la información necesaria para rechazar");
        setIsSubmitting(false);
        setIsRejectDialogOpen(false);
        return;
      }

      reRejectMutation.mutate(
        { 
          approvalId: branchDetails.approvalId, 
          reason 
        },
        {
          onSuccess: () => {
            toast.success("Sucursal rechazada correctamente");
            setIsSubmitting(false);
            setIsRejectDialogOpen(false);
            handleRefresh();
          },
          onError: (error) => {
            toast.error(`Error al rechazar la sucursal: ${error.message}`);
            setIsSubmitting(false);
          }
        }
      );
    } catch (error: any) {
      toast.error(`Error al obtener información de la sucursal: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const getBranchName = (branchId: number | null) => {
    if (!branchId) return undefined;
    const branch = originalBranches.find(b => b.id === branchId);
    return branch?.name;
  };

  const renderEmptyState = () => {
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
        <Coffee className="h-10 w-10 text-green-400/60 mb-2" />
        <p className="font-medium text-sm text-green-700">No hay sucursales aprobadas</p>
        <p className="text-xs mt-1 max-w-xs text-center px-4">
          Aún no se ha aprobado ninguna sucursal
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          className="mt-3 border-green-200 text-green-700 hover:bg-green-50/50 h-7 text-xs"
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
            className="absolute inset-0 overflow-y-auto py-1 px-1 approved-scroll-area"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#86EFAC transparent'
            }}
          >
            {filteredBranches.length === 0 ? (
              renderEmptyState()
            ) : (
              <AnimatePresence mode="popLayout">
                {paginatedBranches.map((branch: ApprovedBranch, index: number) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    index={index}
                    onView={handleViewDetails}
                    type="approved"
                    onReject={openRejectDialog}
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
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50/80 py-2 px-3 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <CardTitle className="text-sm font-medium text-gray-700">Sucursales Aprobadas</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge count={filteredBranches.length} status="approved" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleRefresh}
                    className="h-6 w-6 rounded-full text-gray-500 hover:bg-green-50/80 hover:text-green-700"
                    disabled={refreshAnimation}
                  >
                    <RefreshCw className={`h-3 w-3 ${refreshAnimation ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium bg-green-50 text-green-700 border-green-200 no-arrow">
                  Actualizar lista
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        
        <div className="flex-shrink-0 p-2 ">
          <BranchSearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        
        <div className="flex-grow flex flex-col min-h-0 w-full overflow-hidden">
          {renderContent()}
        </div>
      </Card>
        <BranchDetailsModal 
        branch={selectedBranch}
        onClose={() => setSelectedBranch(null)}
      />
        <BranchRejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={confirmReject}
        branchId={selectedBranchForAction}
        branchName={getBranchName(selectedBranchForAction)}
        isSubmitting={isSubmitting}
      />
    </>
  );
};