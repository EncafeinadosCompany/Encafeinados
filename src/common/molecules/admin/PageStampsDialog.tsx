import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog";
import { Badge } from "@/common/ui/badge";
import { Button } from "@/common/ui/button";
import { usePageStampsQuery } from "@/api/queries/admin/albumQueries";
import { motion, AnimatePresence } from "framer-motion";
import { Stamp as StampIcon, X, Coins, CheckCircle, XCircle, Search, BookOpenCheck } from "lucide-react";

interface PageStampsDialogProps {
  pageId: number | null;
  pageName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PageStampsDialog: React.FC<PageStampsDialogProps> = ({
  pageId,
  pageName,
  isOpen,
  onOpenChange,
}) => {
  const { data, isLoading, error } = usePageStampsQuery(pageId);
  const [filterMode, setFilterMode] = useState<"all" | "available" | "unavailable">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!pageId) return null;

  const filteredStamps = data?.stamps?.filter(stamp => {
    if (searchQuery && !stamp.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !stamp.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filterMode === "available" && !stamp.status) return false;
    if (filterMode === "unavailable" && stamp.status) return false;
    
    return true;
  }) || [];

  const totalStamps = data?.stamps?.length || 0;
  const availableStamps = data?.stamps?.filter(s => s.status).length || 0;
  const unavailableStamps = totalStamps - availableStamps;
  
  const totalValue = data?.stamps?.reduce((sum, stamp) => sum + stamp.coffeecoins_value, 0) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-[#FFFBF6] border-amber-100 rounded-xl p-0 flex flex-col max-h-[97vh] overflow-hidden">
        <DialogHeader className="border-b border-amber-100 bg-gradient-to-r from-[#FAF3E0] to-[#FAF3E0]/30 px-5 py-4 flex-shrink-0 flex justify-between items-center">
          <div className="flex flex-col">
            <DialogTitle className="text-xl font-medium text-[#2C1810] flex items-center gap-2">
              <div className="bg-amber-100 p-1.5 rounded-full">
                <StampIcon className="h-5 w-5 text-[#D4A76A]" />
              </div>
              Colección de Sellos
            </DialogTitle>
            <p className="text-[#6F4E37] text-sm mt-0.5 flex items-center">
              <BookOpenCheck className="h-3.5 w-3.5 mr-1.5 text-[#D4A76A]/70" />
              {pageName}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-800 gap-1">
              <Coins className="h-3.5 w-3.5" />
              {totalValue} CoffeeCoins
            </Badge>
          
          </div>
        </DialogHeader>

        <div className="border-b border-amber-100 bg-white px-4 py-3 flex-shrink-0 ">
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="flex space-x-2">
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-[#FAF3E0] to-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 flex items-center"
              >
                <StampIcon className="h-4 w-4 text-[#D4A76A] mr-1.5" />
                <span className="text-xs font-medium text-[#6F4E37]">{totalStamps} Total</span>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-green-50 to-green-100/30 px-3 py-1.5 rounded-lg border border-green-100 flex items-center"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-xs font-medium text-green-700">{availableStamps} Disponibles</span>
              </motion.div>
              
              {unavailableStamps > 0 && (
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100/30 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center"
                >
                  <XCircle className="h-4 w-4 text-gray-400 mr-1.5" />
                  <span className="text-xs font-medium text-gray-600">{unavailableStamps} Inactiva</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-amber-600/70" />
                <input
                  type="text"
                  placeholder="Buscar sello..."
                  className="pl-8 pr-3 py-1.5 text-sm border border-amber-200 rounded-md bg-white focus:ring-1 focus:ring-amber-400 focus:border-amber-400 w-full md:w-40 lg:w-60 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center bg-white border border-amber-200 rounded-md p-0.5">
                <Button 
                  size="sm"
                  variant="ghost"
                  className={`h-7 px-2 text-xs rounded-sm ${filterMode === "all" ? "bg-amber-100 text-amber-800" : "text-[#6F4E37]"}`}
                  onClick={() => setFilterMode("all")}
                >
                  Todos
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  className={`h-7 px-2 text-xs rounded-sm ${filterMode === "available" ? "bg-green-100 text-green-800" : "text-[#6F4E37]"}`}
                  onClick={() => setFilterMode("available")}
                >
                  Disponibles
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  className={`h-7 px-2 text-xs rounded-sm ${filterMode === "unavailable" ? "bg-gray-100 text-gray-600" : "text-[#6F4E37]"}`}
                  onClick={() => setFilterMode("unavailable")}
                >
                  Inactiva
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 ">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center p-12"
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <StampIcon className="h-12 w-12 text-amber-200 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-t-amber-600 border-r-amber-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-amber-800">Cargando colección...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center"
              >
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <h3 className="text-red-700 font-medium">Error al cargar las estampas</h3>
                  <p className="text-red-600 text-sm mt-1">Intenta nuevamente más tarde</p>
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onOpenChange(false)}
                  >
                    Cerrar
                  </Button>
                </div>
              </motion.div>
            ) : filteredStamps.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="bg-[#FAF3E0]/70 p-6 rounded-full mb-4 shadow-inner">
                  {searchQuery ? (
                    <Search className="h-12 w-12 text-[#D4A76A]/70" />
                  ) : (
                    <StampIcon className="h-12 w-12 text-[#D4A76A]/70" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-[#2C1810] mb-1">
                  {searchQuery ? "Sin resultados" : "Sin estampas"}
                </h3>
                <p className="text-[#6F4E37] text-sm max-w-md">
                  {searchQuery 
                    ? `No se encontraron sellos que coincidan con "${searchQuery}"`
                    : "Esta página aún no tiene sellos para coleccionar. Los sellos se añadirán próximamente."
                  }
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-4 border-amber-200 text-amber-700"
                    onClick={() => setSearchQuery("")}
                  >
                    Limpiar búsqueda
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${filterMode}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[100vh]">
                  {filteredStamps.map((stamp, idx) => (
                    <motion.div 
                      key={stamp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="group relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border-4 border-white">
                        <div className="absolute inset-0 z-0 pointer-events-none">
                          <svg width="100%" height="100%" className="text-amber-100">
                            <pattern id={`stamp-pattern-${stamp.id}`} x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                              <path d="M0,7.5 L5,0 L10,7.5 L5,15 Z" fill="currentColor"/>
                            </pattern>
                            <rect width="100%" height="100%" fill={`url(#stamp-pattern-${stamp.id})`} />
                          </svg>
                        </div>
                        
                        <div className="relative z-10 m-[3px] bg-white rounded-sm overflow-hidden">
                          {stamp.coffeecoins_value > 15 && (
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-[10px] font-bold py-0.5 px-2 rounded-bl-md z-20">
                              PREMIUM
                            </div>
                          )}
                          
                          <div className="aspect-square overflow-hidden bg-[#FAF3E0]/50 relative">
                            {stamp.logo ? (
                              <img 
                                src={stamp.logo}
                                alt={stamp.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-amber-50">
                                <StampIcon className="h-20 w-20 text-[#D4A76A]/30" />
                              </div>
                            )}
                            
                            {!stamp.status && (
                              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 to-white/95 flex items-center justify-center backdrop-blur-[1px] z-10">
                                <div className="transform rotate-[-5deg]">
                                  <div className="relative">
                                    <div className="bg-amber-100 border-2 border-amber-200 rounded-md px-4 py-2 shadow-sm">
                                      <div className="absolute -top-1.5 -right-1.5">
                                        <div className="bg-amber-500/10 backdrop-blur-sm rounded-full h-8 w-8 flex items-center justify-center">
                                          <StampIcon className="h-5 w-5 text-amber-600" />
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-center gap-1">
                                        <p className="text-xs font-medium text-amber-800">TEMPORALMENTE</p>
                                        <p className="text-sm font-semibold text-amber-900 border-t border-b border-amber-300 px-1">
                                          NO DISPONIBLE
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <svg 
                                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 text-amber-800/10"
                                      width="120" 
                                      height="120" 
                                      viewBox="0 0 120 120"
                                    >
                                      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                                      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-3 bg-gradient-to-b from-white to-amber-50/50">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-medium text-[#2C1810] text-sm line-clamp-1">
                                {stamp.name}
                              </h3>
                              <Badge className="bg-amber-100/80 backdrop-blur-sm text-amber-800 text-[10px] flex items-center whitespace-nowrap flex-shrink-0">
                                <Coins className="h-3 w-3 mr-1" />
                                {stamp.coffeecoins_value}
                              </Badge>
                            </div>
                            <p className="text-xs text-[#6F4E37]/80 line-clamp-2 min-h-[2rem] mt-1">
                              {stamp.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};