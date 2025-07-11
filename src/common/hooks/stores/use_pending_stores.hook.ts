import React, { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { StoreDto } from "@/api/types/stores/stores.type";
import { CheckCircle2, XCircle, AlertTriangle } from'@/common/ui/icons'; 
import toast from "react-hot-toast";
import { usePendingStores } from "@/api/queries/stores/stores.query";
import { useChangeStoreStatus } from "@/api/mutations/stores/change_stores_status.mutation";

interface RejectFormData {
  reason: string;
}

export const usePendingStoresWidget = () => {
  // API data
  const { data, isLoading, error } = usePendingStores();
  const queryClient = useQueryClient();
  const changeStatusMutation = useChangeStoreStatus();
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreDto | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean, 
    action: 'approve' | 'reject', 
    storeId: number | null
  }>({
    isOpen: false,
    action: 'approve',
    storeId: null
  });
  const [refreshAnimation, setRefreshAnimation] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectFormOpen, setRejectFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Form handling
  const methods = useForm<RejectFormData>({
    defaultValues: { reason: "" },
    mode: "onChange"
  });

  // Derived state
  const originalStores = useMemo(() => {
    return Array.isArray(data?.stores) ? data?.stores : data?.stores?.stores || [];
  }, [data]);
  
  const filteredStores = useMemo(() => {
    if (!searchTerm) return originalStores;
    
    const term = searchTerm.toLowerCase();
    return originalStores.filter((store: StoreDto) => 
      store.name?.toLowerCase().includes(term) || 
      store.email?.toLowerCase().includes(term)
    );
  }, [originalStores, searchTerm]);

  const paginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredStores.slice(startIndex, endIndex);
  }, [filteredStores, currentPage, itemsPerPage]);
  
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredStores.length / itemsPerPage));
  }, [filteredStores, itemsPerPage]);
  
  // Effects
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);
  
  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollContainer = document.querySelector('.pending-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };
  
  const handleApprove = (id: number) => {
    setConfirmationDialog({
      isOpen: true,
      action: 'approve',
      storeId: id
    });
  };
  
  const handleReject = (id: number) => {
    setSelectedStore(null);
    setRejectReason("");
    setRejectFormOpen(true);
    setConfirmationDialog({
      isOpen: false,
      action: 'reject',
      storeId: id
    });
  };
  
  const handleViewDetails = (store: StoreDto) => {
    setSelectedStore(store);
  };

  const handleRefresh = () => {
    setRefreshAnimation(true);
    queryClient.invalidateQueries({ queryKey: ["stores", "pending"] });
    
    setTimeout(() => {
      setRefreshAnimation(false);
    }, 1000);
  };

  const onRejectFormSubmit = (data: RejectFormData) => {
    setRejectReason(data.reason);
    setRejectFormOpen(false);
    
    setConfirmationDialog({
      isOpen: true,
      action: 'reject',
      storeId: confirmationDialog.storeId
    });
  };
  
  // Store status update
  const confirmAction = () => {
    const { action, storeId } = confirmationDialog;
    
    if (!storeId) return;
    
    setIsSubmitting(true);
    
    changeStatusMutation.mutate({
      storeId,
      status: action === 'approve',
      reason: action === 'reject' ? rejectReason : undefined
    }, {
      onSuccess: () => {
        if (action === 'approve') {
          toast.success('La tienda ha sido aprobada exitosamente', {
            icon: React.createElement(CheckCircle2, { className: "h-4 w-4 text-green-600" }),
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '16px',
              color: '#166534'
            },
            duration: 3000
          });
        } else {
          toast.success('La tienda ha sido rechazada exitosamente', {
            icon: React.createElement(XCircle, { className: "h-4 w-4 text-red-600" }),
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '16px',
              color: '#991b1b'
            },
            duration: 3000
          });
        }
        
        setConfirmationDialog({ isOpen: false, action: 'approve', storeId: null });
        setRejectReason("");
        setIsSubmitting(false);
      },
      onError: (error: any) => {
        console.error('Error al cambiar el estado de la tienda:', error);
        setIsSubmitting(false);
        
        toast.error(error?.response?.data?.message || 'Error al procesar la solicitud', {
          icon: React.createElement(AlertTriangle, { className: "h-4 w-4 text-red-600" }),
          style: {
            background: '#fef2f2',
            border: '1px solid #fecaca',
            padding: '16px',
            color: '#991b1b'
          },
          duration: 5000
        });
      },
    });
  };

  return {
    // Data
    data,
    isLoading,
    error,
    originalStores,
    filteredStores,
    paginatedStores,
    totalPages,
    
    // State
    searchTerm,
    selectedStore,
    confirmationDialog,
    refreshAnimation,
    rejectReason,
    rejectFormOpen,
    isSubmitting,
    currentPage,
    itemsPerPage,
    
    // Form
    methods, // Devuelve todo el objeto methods
    
    // Actions
    setSearchTerm,
    setSelectedStore,
    setConfirmationDialog,
    setRejectFormOpen,
    setItemsPerPage,
    handlePageChange,
    handleApprove,
    handleReject,
    handleViewDetails,
    handleRefresh,
    onRejectFormSubmit,
    confirmAction
  };
};