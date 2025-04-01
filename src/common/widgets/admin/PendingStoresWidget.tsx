import React, { useState, useEffect } from "react";
import { usePendingStores } from "@/api/queries/storesQueries";
import { Store } from "@/api/types/storesTypes";
import { PendingStoreItem } from "@/common/molecules/admin/PendingStoreItem";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Skeleton } from "@/common/ui/skeleton";
import { Badge } from "@/common/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "@/common/ui/dialog";
import { ScrollArea } from "@/common/ui/scroll-area";
import { Input } from "@/common/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coffee, 
  RefreshCw, 
  Search, 
  Grid, 
  List, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  AlertTriangle
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/common/ui/textarea";
import { Label } from "@/common/ui/label";
import { useForm } from "react-hook-form";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/common/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select";

interface RejectFormData {
  reason: string;
}

export const PendingStoresWidget = () => {
  const { data, isLoading, error } = usePendingStores();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
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
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filtrar tiendas por término de búsqueda
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
    const scrollContainer = document.querySelector('.scroll-area-viewport');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };
  
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);
  
  // Manejadores de acciones
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
    
    if (action === 'approve') {
      console.log(`Tienda ${storeId} aprobada`);
      // Implementar lógica de aprobación
    } else {
      console.log(`Tienda ${storeId} rechazada. Motivo: ${rejectReason}`);
      // Implementar lógica de rechazo incluyendo el motivo
      setRejectReason(""); // Limpiar el motivo una vez usado
    }
    
    setConfirmationDialog({ isOpen: false, action: 'approve', storeId: null });
    // Recargar datos después de la acción
    queryClient.invalidateQueries({ queryKey: ["stores", "pending"] });
  };

  // Renderizado basado en el viewMode
  const renderStores = () => {
    if (filteredStores.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Coffee className="h-14 w-14 text-[#D4A76A]/60 mb-3" />
          </motion.div>
          <p className="font-medium text-lg text-[#6F4E37]">No hay tiendas pendientes</p>
          <p className="text-sm mt-1 max-w-xs text-center">
            Todas las solicitudes de tiendas han sido procesadas
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="mt-5 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A]/10"
          >
            Verificar nuevamente
          </Button>
        </div>
      );
    }

    if (viewMode === 'list') {
      return (
        <AnimatePresence>
          <ScrollArea className="h-[calc(100%-4rem)]">
            {paginatedStores.map((store: Store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between p-4 hover:bg-amber-50/20 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="h-11 w-11 rounded-lg bg-gradient-to-b from-[#D4A76A]/20 to-[#6F4E37]/10 flex items-center justify-center overflow-hidden">
                        {store.logo ? (
                          <img 
                            src={store.logo} 
                            alt={store.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[#6F4E37] font-semibold text-xl">
                            {store.name?.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{store.name}</div>
                      <div className="text-sm text-gray-500">
                        {store.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(store)}
                      className="text-blue-600 hover:bg-blue-50/50 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1.5">Ver</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApprove(store.id)}
                      className="text-green-600 hover:bg-green-50/50 hover:text-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1.5">Aprobar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReject(store.id)}
                      className="text-red-600 hover:bg-red-50/50 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1.5">Rechazar</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </ScrollArea>
          
          <div className="mt-auto p-3 border-t">
            <RenderPagination />
          </div>
        </AnimatePresence>
      );
    } else {
      return (
        <>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {paginatedStores.map((store: Store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-14 w-14 rounded-md bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center overflow-hidden shadow-sm">
                      {store.logo ? (
                        <img 
                          src={store.logo} 
                          alt={store.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[#6F4E37] font-semibold text-xl">
                          {store.name?.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{store.name}</div>
                      <div className="text-sm text-gray-500">{store.email}</div>
                    </div>
                    {/* Badge "Pendiente" eliminado */}
                  </div>
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(store)}
                      className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApprove(store.id)}
                      className="text-green-600 hover:bg-green-50 hover:text-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReject(store.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-auto p-3 border-t">
            <RenderPagination />
          </div>
        </>
      );
    }
  };

  const RenderPagination = () => {
    if (totalPages <= 1) return null;
    
    const getPageNumbers = () => {
      const pageNumbers = [];
      
      pageNumbers.push(1);
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(i);
      }
      
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
      
      return [...new Set(pageNumbers)].sort((a, b) => a - b);
    };
    
    const pageNumbers = getPageNumbers();
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-2 px-4">
        <div className="flex items-center text-xs text-gray-500 gap-2">
          <span>Mostrar</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="h-7 w-[60px] border-gray-200">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <span>•</span>
          <span className="min-w-[80px]">
            {filteredStores.length > 0 
              ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredStores.length)} de ${filteredStores.length}`
              : "0 resultados"}
          </span>
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
              />
            </PaginationItem>
            
            {pageNumbers.map((page, index) => {
              if (index > 0 && page > pageNumbers[index - 1] + 1) {
                return (
                  <React.Fragment key={`ellipsis-${index}`}>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  </React.Fragment>
                );
              }
              
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    className={page === currentPage 
                      ? "bg-[#6F4E37] text-white hover:bg-[#6F4E37]/90" 
                      : "hover:bg-[#D4A76A]/10"
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-8">
            <Skeleton className="h-12 w-40" />
            <div className="flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-100">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-3 w-[240px]" />
              </div>
              <div className="ml-auto flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-red-500">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <p className="font-medium text-lg">Error al cargar las tiendas pendientes</p>
          <p className="text-sm mt-2 text-center max-w-sm">
            Ha ocurrido un error al intentar obtener las tiendas. Por favor, intente nuevamente más tarde.
          </p>
          <Button 
            variant="outline"
            className="mt-6 border-red-200"
            onClick={handleRefresh}
          >
            Reintentar
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar tiendas..." 
                className="pl-8 h-9 bg-white border-gray-200 rounded-md focus:ring-1 focus:ring-[#D4A76A] focus:border-[#D4A76A]" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 hidden sm:inline-block">
                {filteredStores.length} {filteredStores.length === 1 ? 'tienda' : 'tiendas'}
              </span>
              
              <div className="flex rounded-md overflow-hidden border border-gray-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-none ${viewMode === 'list' ? 'bg-amber-50 text-[#6F4E37]' : 'text-gray-500'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost" 
                  size="icon"
                  className={`h-9 w-9 rounded-none ${viewMode === 'grid' ? 'bg-amber-50 text-[#6F4E37]' : 'text-gray-500'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                className="h-9 gap-1.5 border-[#D4A76A]/80 text-[#6F4E37] hover:bg-[#D4A76A]/10"
                disabled={refreshAnimation}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshAnimation ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {renderStores()}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="w-full shadow-sm border-gray-100 bg-white h-full flex flex-col rounded-xl">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100/30 py-3 px-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[#6F4E37] text-lg font-medium">Tiendas Pendientes</CardTitle>
              <CardDescription className="text-gray-600">
                Administra las solicitudes de tiendas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          {renderContent()}
        </CardContent>
      </Card>
      
      {/* Diálogo de detalles de tienda - CORREGIDO */}
      <Dialog open={!!selectedStore} onOpenChange={(open) => !open && setSelectedStore(null)}>
        <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-lg bg-white rounded-lg overflow-hidden z-50">
          <div className="relative z-10">
            <DialogHeader className="border-b pb-3">
              <DialogTitle className="text-[#6F4E37]">Detalles de la tienda</DialogTitle>
              <DialogDescription>
                Información de solicitud
              </DialogDescription>
            </DialogHeader>
            
            {selectedStore && (
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-6">
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
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-500 col-span-1">Documento:</span>
                    <span className="font-medium col-span-2">{selectedStore.type_document} {selectedStore.number_document}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-500 col-span-1">Email:</span>
                    <span className="font-medium col-span-2">{selectedStore.email}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 text-sm">
                    <span className="text-gray-500 col-span-1">Teléfono:</span>
                    <span className="font-medium col-span-2">{selectedStore.phone_number || 'No especificado'}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedStore(null)}
                    className="border-gray-200"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de formulario de rechazo - CORREGIDO */}
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
                  className="min-h-[120px] resize-none"
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
                  className="bg-red-600 hover:bg-red-700 text-white" // Añadir esta línea
                  disabled={!isValid}
                >
                  Continuar
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmación - CORREGIDO */}
      <Dialog 
        open={confirmationDialog.isOpen} 
        onOpenChange={(open) => !open && setConfirmationDialog({...confirmationDialog, isOpen: false})}
      >
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden z-50">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent opacity-70 pointer-events-none"></div>
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
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90' 
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:bg-red-700 text-white'} // Modificar esta línea
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