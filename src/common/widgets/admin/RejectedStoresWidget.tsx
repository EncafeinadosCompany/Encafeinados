import React, { useState } from "react";
import { useRejectedStores } from "@/api/queries/storesQueries";
import { Store } from "@/api/types/storesTypes";
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter 
} from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Skeleton } from "@/common/ui/skeleton";
import { Badge } from "@/common/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "@/common/ui/dialog";
import { Input } from "@/common/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XCircle, RefreshCw, Search, Eye, AlertTriangle, ChevronLeft, ChevronRight, ShieldX
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/common/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/common/ui/tooltip";

export const RejectedStoresWidget = () => {
  const { data, isLoading, error } = useRejectedStores();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [refreshAnimation, setRefreshAnimation] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredStores = React.useMemo(() => {
    const rejectedStores = Array.isArray(data?.stores) ? data?.stores : data?.stores?.stores || [];
    
    if (!searchTerm) return rejectedStores;
    
    const term = searchTerm.toLowerCase();
    return rejectedStores.filter((store: Store) => 
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
    const scrollContainer = document.querySelector('.rejected-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };
  
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);
  
  const handleViewDetails = (store: Store) => {
    setSelectedStore(store);
  };

  const handleRefresh = () => {
    setRefreshAnimation(true);
    queryClient.invalidateQueries({ queryKey: ["stores", "rejected"] });
    
    setTimeout(() => {
      setRefreshAnimation(false);
    }, 1000);
  };

  const renderRejectedStoreCards = () => {
    // Obtener la lista original de tiendas sin filtrar para comparar
    const originalStores = Array.isArray(data?.stores) ? data?.stores : data?.stores?.stores || [];
    
    if (filteredStores.length === 0) {
      // Mostrar un mensaje diferente si hay tiendas pero ninguna coincide con la búsqueda
      if (originalStores.length > 0 && searchTerm) {
        return (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <Search className="h-10 w-10 text-gray-300 mb-2 stroke-[1.5px]" />
            <p className="font-medium text-sm text-gray-500">No se encontraron resultados</p>
            <p className="text-xs mt-1 max-w-xs text-center px-4">
              No hay tiendas que coincidan con "{searchTerm}"
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
      
      // Mensaje cuando no hay tiendas rechazadas
      return (
        <div className="flex flex-col items-center justify-center py-6 text-gray-400">
          <ShieldX className="h-10 w-10 text-red-400/60 mb-2" />
          <p className="font-medium text-sm text-red-700">No hay tiendas rechazadas</p>
          <p className="text-xs mt-1 max-w-xs text-center px-4">
            No se ha rechazado ninguna solicitud de tienda
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="mt-3 border-red-200 text-red-700 hover:bg-red-50/50 h-7 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${refreshAnimation ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>
      );
    }

    return (
      <AnimatePresence mode="popLayout">
        {paginatedStores.map((store: Store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, delay: index * 0.03 }}
            className="mb-2 last:mb-1"
          >
            <Card className="bg-white border border-gray-100 hover:shadow-sm hover:border-red-200/50 transition-all duration-200 w-full group">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div className="h-9 w-9 rounded-md bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                      {store.logo ? (
                        <img 
                          src={store.logo} 
                          alt={store.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-red-700 font-semibold text-sm">
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
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    );
  };

  const RenderPagination = () => {
    return (
      <div className="flex items-center justify-between gap-1 py-1.5 px-2 text-xs">
        <div className="text-gray-500">
          {filteredStores.length > 0 
            ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredStores.length)} de ${filteredStores.length}`
            : "0 resultados"}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Controles de paginación solo visibles si hay más de 1 página */}
          {totalPages > 1 && (
            <>
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
            </>
          )}
          
          {/* Selector de cantidad siempre visible */}
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
        <div className="flex-grow relative h-0 min-h-0 w-full">
          <div 
            className="absolute inset-0 overflow-y-auto py-1 px-1 rejected-scroll-area"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#FCA5A5 transparent'
            }}
          >
            {renderRejectedStoreCards()}
          </div>
        </div>
        
        {/* Siempre mostrar el CardFooter con el paginador */}
        <CardFooter className="p-0 w-full flex-shrink-0">
          <RenderPagination />
        </CardFooter>
      </>
    );
  };

  return (
    <>
      <Card className="w-full h-full shadow-sm border-gray-200 overflow-hidden flex flex-col">
        <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50/80 py-2 px-3 flex justify-between items-center flex-shrink-0 border-b">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <CardTitle className="text-sm font-medium text-gray-700">Tiendas Rechazadas</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-red-600 bg-red-50 border-red-200 text-xs font-normal h-5"
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
                    className="h-6 w-6 rounded-full text-gray-500 hover:bg-red-50/80 hover:text-red-700"
                    disabled={refreshAnimation}
                  >
                    <RefreshCw className={`h-3 w-3 ${refreshAnimation ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium bg-red-50 text-red-700 border-red-200 no-arrow">
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
              className="pl-7 h-7 text-xs bg-white border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-red-400 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-grow flex flex-col min-h-0 w-full overflow-hidden">
          {renderContent()}
        </div>
      </Card>

      <Dialog 
        open={!!selectedStore} 
        onOpenChange={(open) => {
          if (!open) {
            // Al cerrar, limpiamos completamente el estado
            setSelectedStore(null);
          }
        }}
      >
        <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-lg bg-white rounded-lg overflow-hidden z-50">
          <div className="relative z-10">
            <DialogHeader className="pb-3">
              <DialogTitle className="text-red-700">Detalles de la tienda</DialogTitle>
              <DialogDescription>
                Información completa de la tienda rechazada
              </DialogDescription>
            </DialogHeader>
            
            {selectedStore && (
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-b from-red-100/50 to-rose-100/30 flex items-center justify-center overflow-hidden">
                    {selectedStore.logo ? (
                      <img 
                        src={selectedStore.logo} 
                        alt={selectedStore.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-red-700 font-semibold text-2xl">
                        {selectedStore.name?.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{selectedStore.name}</h4>
                    <Badge variant="outline" className="mt-1 bg-red-50 text-red-700 font-normal border-red-200">
                      {selectedStore.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-red-50/50 rounded-md p-3 border border-red-100">
                    <h5 className="text-xs font-medium text-red-700 mb-1">Motivo del rechazo</h5>
                    <p className="text-sm text-gray-700">
                      {(selectedStore as any).rejection_reason || "No se especificó un motivo de rechazo."}
                    </p>
                  </div>
                
                  <div className="space-y-3 bg-gray-50 rounded-md p-3">
                    <div className="grid grid-cols-3 text-sm border-gray-100 pb-2">
                      <span className="text-gray-500 col-span-1">Documento:</span>
                      <span className="font-medium col-span-2">{selectedStore.type_document} {selectedStore.number_document}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 text-sm border-gray-100 pb-2">
                      <span className="text-gray-500 col-span-1">Email:</span>
                      <span className="font-medium col-span-2">{selectedStore.email}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 text-sm border-gray-100 pb-2">
                      <span className="text-gray-500 col-span-1">Teléfono:</span>
                      <span className="font-medium col-span-2">{selectedStore.phone_number || 'No especificado'}</span>
                    </div>
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
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};