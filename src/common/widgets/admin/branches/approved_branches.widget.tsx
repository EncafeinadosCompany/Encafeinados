import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Skeleton } from "@/common/ui/skeleton";
import { 
  RefreshCw, 
  AlertTriangle, 
  Coffee, 
  Search, 
  CheckCircle 
} from 'lucide-react';
import { AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip";
import { ApprovedBranch, BranchApprovalDetails } from '@/api/types/branches/branches_approval.types';
import { StatusBadge } from "@/common/atoms/common/status_badge.atom";
import { BranchSearchBar } from "@/common/molecules/admin/branch/branch_search_bar.molecule";
import { BranchPagination } from "@/common/molecules/admin/branch/branch_pagination.molecule";
import { BranchCard } from "@/common/molecules/admin/branch/branch_card.molecule";
import { BranchDetailsModal } from "@/common/molecules/admin/branch/branch_details_enhanced_modal.molecule";
import { BranchRejectDialog } from "@/common/molecules/admin/branch/branch_reject_dialog.molecule";
import { useApprovedBranchesWidget } from "@/common/hooks/branches/use_approved_branches.hook";
import { useReRejectBranchMutation } from "@/api/mutations/branches/branch_states.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { useBranchApprovalDetails } from "@/api/queries/branches/branch.query";
import AuthClient from "@/api/client/axios";
import toast from 'react-hot-toast';
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

export const ApprovedBranchesWidget = () => {
  const checkUserAuth = () => {
    const userId = getEncryptedItem('userId');
    if (!userId) {
      toast.error('No se detecta una sesión activa. Por favor, inicia sesión nuevamente.');
      return false;
    }
    return true;
  };

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

  const openRejectDialog = (branchId: number) => {
    setSelectedBranchForAction(branchId);
    setIsRejectDialogOpen(true);
  };
  const confirmReject = async (branchId: number, reason: string) => {
    if (!checkUserAuth()) return;
    
    setIsSubmitting(true);
    
    try {
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
        <div className="flex flex-col items-center justify-center py-8 px-6">
          <div className="bg-[#E8F5E8]/30 p-3 rounded-xl mb-4">
            <Search className="h-6 w-6 text-[#4ADE80]/70" />
          </div>
          <h3 className="font-medium text-[#166534] mb-2">Sin resultados</h3>
          <p className="text-sm text-[#16803D]/70 text-center max-w-xs mb-4">
            No hay sucursales que coincidan con <span className="font-medium text-[#166534]">"{searchTerm}"</span>
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSearchTerm("")}
            className="bg-white border-[#BBF7D0] text-[#16803D] hover:bg-[#E8F5E8]/20 hover:border-[#4ADE80]/50 text-xs h-8 px-3"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Limpiar búsqueda
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-8 px-6">
        <div className="bg-[#E8F5E8]/30 p-4 rounded-xl mb-4">
          <Coffee className="h-8 w-8 text-[#4ADE80]/70" />
        </div>
        <h3 className="font-semibold text-[#166534] mb-2">Aún no hay aprobaciones</h3>
        <p className="text-sm text-[#16803D]/70 text-center max-w-sm mb-4">
          Las sucursales aprobadas aparecerán aquí una vez que se procesen las solicitudes.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          className="bg-white border-[#BBF7D0] text-[#16803D] hover:bg-[#E8F5E8]/20 hover:border-[#4ADE80]/50 text-xs h-8 px-3"
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
        <div className="p-4 space-y-4 w-full flex-grow">
          {/* Loading cards skeleton */}
          <div className="space-y-3">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="rounded-xl border border-[#BBF7D0]/30 p-4 bg-white/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-6">
          <div className="bg-red-50/50 p-3 rounded-xl mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="font-medium text-red-600 mb-2">Error al cargar</h3>
          <p className="text-sm text-red-500/70 text-center max-w-xs mb-4">
            Hubo un problema al obtener las sucursales aprobadas
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="bg-white border-red-200 text-red-600 hover:bg-red-50/30 hover:border-red-300 text-xs h-8 px-3"
          >
            <RefreshCw className={`h-3 w-3 mr-1.5 ${refreshAnimation ? 'animate-spin' : ''}`} />
            Reintentar
          </Button>
        </div>
      );
    }
    
    return (
      <>
        <div className="flex-grow relative h-0 min-h-0 w-full">
          <div 
            className="absolute inset-0 overflow-y-auto py-2 px-2 approved-scroll-area"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#4ADE80 transparent'
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
      <Card className="w-full h-full shadow-lg border border-[#BBF7D0]/40 bg-[#F0FDF4] overflow-hidden flex flex-col">
        <CardHeader className="bg-gradient-to-r from-[#E8F5E8]/60 to-[#DCFCE7]/60 py-3 px-4 flex justify-between items-center flex-shrink-0 border-b border-[#BBF7D0]/30">
          <div className="flex items-center space-x-3">
            <div className="bg-[#4ADE80]/10 p-2 rounded-full">
              <CheckCircle className="h-4 w-4 text-[#4ADE80]" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-[#166534]">
                Sucursales Aprobadas
              </CardTitle>
              <p className="text-xs text-[#16803D]/70 mt-0.5">
                Historial de aprobaciones
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <StatusBadge count={filteredBranches.length} status="approved" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleRefresh}
                    className="h-8 w-8 rounded-lg bg-white/70 hover:bg-white text-[#16803D] hover:text-[#166534] border border-[#BBF7D0]/50 hover:border-[#4ADE80]/30 transition-all duration-200"
                    disabled={refreshAnimation}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${refreshAnimation ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] shadow-sm">
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