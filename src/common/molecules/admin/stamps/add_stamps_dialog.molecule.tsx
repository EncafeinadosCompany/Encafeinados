import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Checkbox } from "@/common/ui/checkbox";
import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";
import {  Stamp as StampIcon, Search, Check, X, Loader2,  Coins, PlusCircle, BookOpenCheck } from "lucide-react";
import toast from 'react-hot-toast';
import { Badge } from "@/common/ui/badge";
import { useCreateStampsToPageMutation } from "@/api/mutations/album/stamps.mutation";
import { useAllStampsQuery } from "@/api/queries/album/stamps.query";

interface AddStampsDialogProps {
  pageId: number | null;
  pageName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddStampsDialog: React.FC<AddStampsDialogProps> = ({pageId,pageName,isOpen,onOpenChange,onSuccess}) => {
  const [selectedStampIds, setSelectedStampIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const { data, isLoading, error } = useAllStampsQuery();
  const addStampsMutation = useCreateStampsToPageMutation();

  if (!pageId) return null;

  const filteredStamps = data?.stamps?.filter(stamp => {
    if (searchQuery && !stamp.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !stamp.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (showOnlyActive && !stamp.status) return false;
    
    return true;
  }) || [];

  const toggleStampSelection = (stampId: number) => {
    setSelectedStampIds(prev => 
      prev.includes(stampId)
        ? prev.filter(id => id !== stampId)
        : [...prev, stampId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStampIds.length === filteredStamps.length) {
      setSelectedStampIds([]);
    } else {
      setSelectedStampIds(filteredStamps.map(stamp => stamp.id));
    }
  };

  const handleAddStamps = async () => {
    if (selectedStampIds.length === 0) {
      toast.error("Selecciona al menos una estampa");
      return;
    }
    
    try {
      await addStampsMutation.mutateAsync({
        pageId,
        stampIds: selectedStampIds
      });
      
      toast.success(`${selectedStampIds.length} estampa${selectedStampIds.length !== 1 ? 's' : ''} añadida${selectedStampIds.length !== 1 ? 's' : ''} correctamente`);
      onSuccess?.();
      onOpenChange(false);
      setSelectedStampIds([]);
    } catch (error) {
      toast.error("Error al añadir estampas a la página");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setSelectedStampIds([]);
        setSearchQuery("");
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-4xl bg-[#FFFBF6] border-amber-100 rounded-xl p-0 flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="border-b border-amber-100 bg-gradient-to-r from-[#FAF3E0] to-[#FAF3E0]/30 px-5 py-4 flex-shrink-0 flex justify-between items-center">
          <div className="flex flex-col">
            <DialogTitle className="text-xl font-medium text-[#2C1810] flex items-center gap-2">
              <div className="bg-amber-100 p-1.5 rounded-full">
                <PlusCircle className="h-5 w-5 text-[#D4A76A]" />
              </div>
              Añadir Estampas
            </DialogTitle>
            <p className="text-[#6F4E37] text-sm mt-0.5 flex items-center">
              <BookOpenCheck className="h-3.5 w-3.5 mr-1.5 text-[#D4A76A]/70" />
              {pageName}
            </p>
          </div>
          
         
        </DialogHeader>

        <div className="border-b border-amber-100 bg-white px-4 py-3 flex-shrink-0">
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-amber-600/70" />
                <Input
                  placeholder="Buscar estampa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 border-amber-200 focus:border-amber-400 text-sm py-1.5"
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

              <div className="flex items-center">
                <Checkbox
                  id="active-only"
                  checked={showOnlyActive}
                  onCheckedChange={(checked) => setShowOnlyActive(!!checked)}
                  className="border-amber-300 text-amber-600"
                />
                <Label
                  htmlFor="active-only"
                  className="ml-1.5 text-sm text-[#6F4E37] cursor-pointer"
                >
                  Solo activas
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedStampIds.length > 0 && (
                <Badge className="bg-amber-600/90 text-white">
                  {selectedStampIds.length} seleccionada{selectedStampIds.length !== 1 ? 's' : ''}
                </Badge>
              )}
              
              {filteredStamps.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-amber-200 text-amber-700 hover:bg-amber-50 text-xs"
                  onClick={handleSelectAll}
                >
                  {selectedStampIds.length === filteredStamps.length ? "Deseleccionar todo" : "Seleccionar todo"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal - Lista de estampas */}
        <div className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <StampIcon className="h-12 w-12 text-amber-200 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-t-amber-600 border-r-amber-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-amber-800">Cargando estampas...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <X className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-red-700 font-medium">Error al cargar las estampas</h3>
                <p className="text-red-600 text-sm mt-1">Intenta nuevamente más tarde</p>
              </div>
            </div>
          ) : filteredStamps.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-[#FAF3E0]/70 p-6 rounded-full mb-4 shadow-inner">
                <Search className="h-12 w-12 text-[#D4A76A]/70" />
              </div>
              <h3 className="text-lg font-medium text-[#2C1810] mb-1">
                No se encontraron estampas
              </h3>
              <p className="text-[#6F4E37] text-sm max-w-md">
                {searchQuery
                  ? `No hay estampas que coincidan con "${searchQuery}"`
                  : "No hay estampas disponibles para añadir a esta página"
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredStamps.map(stamp => (
                <div
                  key={stamp.id}
                  onClick={() => toggleStampSelection(stamp.id)}
                  className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
                    selectedStampIds.includes(stamp.id)
                      ? "border-amber-500 bg-amber-50/50 shadow-md"
                      : "border-amber-100 bg-white hover:border-amber-200 hover:bg-amber-50/30"
                  }`}
                >
                  <div className="flex p-3">
                    {/* Checkbox */}
                    <div className="flex items-start pr-3">
                      <Checkbox
                        checked={selectedStampIds.includes(stamp.id)}
                        className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 mt-1"
                        onCheckedChange={() => toggleStampSelection(stamp.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {/* Imagen/Logo de la estampa */}
                    <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-[#FAF3E0]/50 mr-3">
                      {stamp.logo ? (
                        <img
                          src={stamp.logo}
                          alt={stamp.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <StampIcon className="h-8 w-8 text-[#D4A76A]/50" />
                        </div>
                      )}
                    </div>
                    
                    {/* Información de la estampa */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-[#2C1810] text-sm truncate pr-2">
                          {stamp.name}
                        </h3>
                        <Badge className="bg-amber-100/80 text-amber-800 text-[10px] whitespace-nowrap flex items-center">
                          <Coins className="h-2.5 w-2.5 mr-0.5" />
                          {stamp.coffeecoins_value}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#6F4E37]/70 line-clamp-2 min-h-[2em] mb-1">
                        {stamp.description}
                      </p>
                      <Badge className={stamp.status 
                        ? "bg-green-100/80 text-green-700 text-[10px]" 
                        : "bg-gray-100/80 text-gray-600 text-[10px]"
                      }>
                        {stamp.status ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="border-t border-amber-100 bg-gradient-to-b from-white to-[#FAF3E0]/30 px-4 py-3 flex justify-between items-center">
          <div className="text-sm text-[#6F4E37]">
            {filteredStamps.length} estampas disponibles
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-amber-200 text-[#6F4E37] hover:bg-amber-50"
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleAddStamps}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={selectedStampIds.length === 0 || addStampsMutation.isPending}
            >
              {addStampsMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1.5" />
              )}
              Añadir {selectedStampIds.length > 0 ? `(${selectedStampIds.length})` : ""} 
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};