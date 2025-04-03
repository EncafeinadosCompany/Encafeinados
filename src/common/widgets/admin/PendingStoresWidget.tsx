import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { Store } from "@/api/types/storesTypes";
import { usePendingStores } from "@/api/queries/storesQueries";

import { Input } from "@/common/ui/input";
import { Badge } from "@/common/ui/badge";
import { Label } from "@/common/ui/label";
import { Button } from "@/common/ui/button";
import { Textarea } from "@/common/ui/textarea";
import { Skeleton } from "@/common/ui/skeleton";
import { ScrollArea } from "@/common/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/common/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "@/common/ui/dialog";
import { Coffee, RefreshCw, Search, CheckCircle2, XCircle, Eye, AlertTriangle, ChevronLeft, ChevronRight} from "@/common/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger} from "@/common/ui/tooltip";

import { motion, AnimatePresence } from "framer-motion";

interface RejectFormData {
  reason: string;
}

export const PendingStoresWidget = () => {
  const { data, isLoading, error } = usePendingStores();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{isOpen: boolean, action: 'approve' | 'reject', storeId: number | null}>({
    isOpen: false,
    action: 'approve',
    storeId: null
  });
  const [refreshAnimation, setRefreshAnimation] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectFormOpen, setRejectFormOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<RejectFormData>({
    defaultValues: {
      reason: ""
    },
    mode: "onChange"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredStores = React.useMemo(() => {
    const pendingStores = Array.isArray(data?.stores) ? data?.stores : data?.stores?.stores || [];
    
    if (!searchTerm) return pendingStores;
    
    const term = searchTerm.toLowerCase();
    return pendingStores.filter((store: Store) => 
      store.name?.toLowerCase().includes(term) || 
      store.email?.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const paginatedStores = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredStores.slice(startIndex, endIndex);
  }, [filteredStores, currentPage, itemsPerPage]);
  
  const totalPages = React.useMemo(() => {
    return Math.max(1, Math.ceil(filteredStores.length / itemsPerPage));
  }, [filteredStores, itemsPerPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollContainer = document.querySelector('.pending-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };
  
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);
  
  const handleApprove = (id: number) => {
    setConfirmationDialog({
      isOpen: true,
      action: 'approve',
      storeId: id
    });
  };
  
  const handleReject = (id: number) => {
    setRejectFormOpen(true);
    setConfirmationDialog({
      isOpen: false,
      action: 'reject',
      storeId: id
    });
  };
  
  const handleViewDetails = (store: Store) => {
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

  const confirmAction = () => {
    const { action, storeId } = confirmationDialog;
    setConfirmationDialog({ isOpen: false, action: 'approve', storeId: null });
    queryClient.invalidateQueries({ queryKey: ["stores", "pending"] });
  };

const renderPendingStoreCards = () => {
  if (filteredStores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-6 text-gray-400">
        <Coffee className="h-10 w-10 text-[#D4A76A]/60 mb-2" />
        <p className="font-medium text-sm text-[#6F4E37]">No hay tiendas pendientes</p>
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
  }
  return (
    <div className="w-full px-1 py-1">
      <AnimatePresence>
        {paginatedStores.map((store: Store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="mb-3 last:mb-1"
          >
            <Card className="bg-white border border-gray-100 hover:shadow-sm hover:border-amber-200/50 transition-all duration-200 w-full group">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div className="h-9 w-9 rounded-md bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                      {store.logo ? (
                        <img 
                          src={store.logo} 
                          alt={store.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[#6F4E37] font-semibold text-sm">
                          {store.name?.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-800 truncate text-sm">{store.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {store.email?.substring(0, 14)}...
                      </div>
                    </div>
                  </div>
                
                  <div className="flex space-x-1 items-center">
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(store)}
                            className="h-7 w-7 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 no-arrow">
                          Ver detalles
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(store.id)}
                            className="h-7 w-7 text-green-600 hover:bg-green-50/50 hover:text-green-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs font-medium bg-green-50 text-green-700 border-green-200 no-arrow">
                          Aprobar tienda
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(store.id)}
                            className="h-7 w-7 text-red-600 hover:bg-red-50/50 hover:text-red-700"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs font-medium bg-red-50 text-red-700 border-red-200 no-arrow">
                          Rechazar tienda
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
  const RenderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between gap-1 py-1.5 px-2 text-xs border-t">
        <div className="text-gray-500">
          {filteredStores.length > 0 
            ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredStores.length)} de ${filteredStores.length}`
            : "0 resultados"}
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-6 w-6 rounded-md"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          
          <span className="text-xs px-2 font-medium">
            {currentPage} / {totalPages}
          </span>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-6 w-6 rounded-md"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="h-6 w-[45px] border-gray-200 text-xs ml-1">
              <SelectValue placeholder="6" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <ScrollArea 
          className="flex-grow overflow-auto pending-scroll-area w-full" 
          type="always" 
          scrollHideDelay={0}
        >
          <div className="p-1 pb-2">
            {renderPendingStoreCards()}
          </div>
        </ScrollArea>
        
        {filteredStores.length > 0 && (
          <CardFooter className="p-0 border-t w-full flex-shrink-0">
            <RenderPagination />
          </CardFooter>
        )}
      </>
    );
  };

  return (
    <>
      <Card className="w-full h-full shadow-sm border-gray-200 overflow-hidden flex flex-col">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50/80 py-2 px-3 flex justify-between items-center flex-shrink-0 border-b">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <CardTitle className="text-sm font-medium text-gray-700">Tiendas Pendientes</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-amber-600 bg-amber-50 border-amber-200 text-xs font-normal h-5"
            >
              {filteredStores.length}
            </Badge>
            
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
        
        <div className="flex-shrink-0 p-2 border-b">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input 
              placeholder="Buscar..." 
              className="pl-7 h-7 text-xs bg-white border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-amber-400 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-grow flex flex-col min-h-0 w-full">
          {renderContent()}
        </div>
      </Card>

      <Dialog open={!!selectedStore} onOpenChange={(open) => !open && setSelectedStore(null)}>
        <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-lg bg-white rounded-lg overflow-hidden z-50">
          <div className="relative z-10">
            <DialogHeader className=" pb-3">
              <DialogTitle className="text-[#6F4E37]">Detalles de la tienda</DialogTitle>
              <DialogDescription>
                Información completa de solicitud
              </DialogDescription>
            </DialogHeader>
            
            {selectedStore && (
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-b from-[#D4A76A]/20 to-[#6F4E37]/10 flex items-center justify-center overflow-hidden">
                    {selectedStore.logo ? (
                      <img 
                        src={selectedStore.logo} 
                        alt={selectedStore.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[#6F4E37] font-semibold text-2xl">
                        {selectedStore.name?.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{selectedStore.name}</h4>
                    <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 font-normal">
                      {selectedStore.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3 bg-gray-50 rounded-md p-3">
                  <div className="grid grid-cols-3 text-sm  border-gray-100 pb-2">
                    <span className="text-gray-500 col-span-1">Documento:</span>
                    <span className="font-medium col-span-2">{selectedStore.type_document} {selectedStore.number_document}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 text-sm  border-gray-100 pb-2">
                    <span className="text-gray-500 col-span-1">Email:</span>
                    <span className="font-medium col-span-2">{selectedStore.email}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 text-sm  border-gray-100 pb-2">
                    <span className="text-gray-500 col-span-1">Teléfono:</span>
                    <span className="font-medium col-span-2">{selectedStore.phone_number || 'No especificado'}</span>
                  </div>            
                </div>         
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedStore(null)}
                    className="border-gray-200"
                  >
                    Cerrar
                  </Button>
                  <Button 
                    variant="default"
                    className="bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] text-white hover:opacity-90"
                    onClick={() => {
                      setSelectedStore(null);
                      handleApprove(selectedStore.id);
                    }}
                  >
                    Aprobar tienda
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={rejectFormOpen} onOpenChange={(open) => {
        if (!open) {
          setRejectFormOpen(false);
          reset();
        }
      }}>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden z-50">
          <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent opacity-70 pointer-events-none"></div>
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-red-600">Rechazar Tienda</DialogTitle>
              <DialogDescription>
                Por favor, indica el motivo por el cual se rechaza esta solicitud de tienda.
                Este motivo será enviado al solicitante.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onRejectFormSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Motivo de rechazo <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Explique por qué se rechaza esta solicitud..."
                  className="min-h-[120px] resize-none focus-visible:ring-red-400"
                  {...register("reason", { 
                    required: "El motivo de rechazo es obligatorio",
                    minLength: {
                      value: 10,
                      message: "El motivo debe tener al menos 10 caracteres"
                    }
                  })}
                />
                {errors.reason && (
                  <p className="text-sm text-red-500">{errors.reason.message}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRejectFormOpen(false);
                    reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={!isValid}
                >
                  Continuar
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={confirmationDialog.isOpen} 
        onOpenChange={(open) => !open && setConfirmationDialog({...confirmationDialog, isOpen: false})}
      >
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden z-50">
          <div className={`absolute inset-0 bg-gradient-to-b ${confirmationDialog.action === 'approve' ? 'from-green-50/50' : 'from-red-50/50'} to-transparent opacity-70 pointer-events-none`}></div>
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className={confirmationDialog.action === 'approve' ? 'text-green-600' : 'text-red-600'}>
                {confirmationDialog.action === 'approve' ? 'Aprobar tienda' : 'Rechazar tienda'}
              </DialogTitle>
              <DialogDescription>
                {confirmationDialog.action === 'approve' 
                  ? '¿Estás seguro de que deseas aprobar esta tienda? La tienda aparecerá inmediatamente en la plataforma.'
                  : '¿Estás seguro de que deseas rechazar esta tienda? Esta acción no se puede deshacer.'
                }
              </DialogDescription>
            </DialogHeader>
            
            {confirmationDialog.action === 'reject' && rejectReason && (
              <div className="my-4 p-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm font-medium text-red-800">Motivo de rechazo:</p>
                <p className="text-sm text-red-700 mt-1">{rejectReason}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setConfirmationDialog({...confirmationDialog, isOpen: false})}
              >
                Cancelar
              </Button>
              <Button 
                variant={confirmationDialog.action === 'approve' ? 'default' : 'destructive'}
                className={confirmationDialog.action === 'approve' 
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90 text-white' 
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:bg-red-700 text-white'}
                onClick={confirmAction}
              >
                {confirmationDialog.action === 'approve' ? 'Sí, aprobar' : 'Sí, rechazar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};