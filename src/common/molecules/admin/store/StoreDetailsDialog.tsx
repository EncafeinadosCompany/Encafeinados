import React from 'react';
import { Store } from "@/api/types/storesTypes";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import { StoreAvatar } from "@/common/atoms/StoreAvatar";

interface StoreDetailsDialogProps {
  store: Store | null;
  onClose: () => void;
  onApprove: (id: number) => void;
}

export const StoreDetailsDialog = ({ store, onClose, onApprove }: StoreDetailsDialogProps) => {
  if (!store) return null;

  return (
    <Dialog open={!!store} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-lg bg-white rounded-lg overflow-hidden z-50">
        <div className="relative z-10">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[#6F4E37]">Detalles de la tienda</DialogTitle>
            <DialogDescription>
              Información completa de solicitud
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <StoreAvatar 
                logo={store.logo} 
                name={store.name} 
                type="pending" 
                size="lg" 
              />
              <div>
                <h4 className="font-medium text-lg">{store.name}</h4>
                <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 font-normal">
                  {store.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3 bg-gray-50 rounded-md p-3">
              <div className="grid grid-cols-3 text-sm border-gray-100 pb-2">
                <span className="text-gray-500 col-span-1">Documento:</span>
                <span className="font-medium col-span-2">{store.type_document} {store.number_document}</span>
              </div>
              
              <div className="grid grid-cols-3 text-sm border-gray-100 pb-2">
                <span className="text-gray-500 col-span-1">Email:</span>
                <span className="font-medium col-span-2">{store.email}</span>
              </div>
              
              <div className="grid grid-cols-3 text-sm border-gray-100 pb-2">
                <span className="text-gray-500 col-span-1">Teléfono:</span>
                <span className="font-medium col-span-2">{store.phone_number || 'No especificado'}</span>
              </div>            
            </div>         
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-200"
              >
                Cerrar
              </Button>
              <Button 
                variant="default"
                className="bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] text-white hover:opacity-90"
                onClick={() => {
                  onClose();
                  onApprove(store.id);
                }}
              >
                Aprobar tienda
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};