import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { RefreshCw } from "lucide-react";

interface StoreConfirmDialogProps {
  isOpen: boolean;
  action: 'approve' | 'reject';
  onClose: () => void;
  onConfirm: () => void;
  rejectReason?: string;
  isSubmitting: boolean;
}

export const StoreConfirmDialog = ({ 
  isOpen, 
  action, 
  onClose, 
  onConfirm, 
  rejectReason, 
  isSubmitting 
}: StoreConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden z-50">
        <div className={`absolute inset-0 bg-gradient-to-b ${action === 'approve' ? 'from-green-50/50' : 'from-red-50/50'} to-transparent opacity-70 pointer-events-none`}></div>
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className={action === 'approve' ? 'text-green-600' : 'text-red-600'}>
              {action === 'approve' ? 'Aprobar tienda' : 'Rechazar tienda'}
            </DialogTitle>
            <DialogDescription>
              {action === 'approve' 
                ? '¿Estás seguro de que deseas aprobar esta tienda? La tienda aparecerá inmediatamente en la plataforma.'
                : '¿Estás seguro de que deseas rechazar esta tienda? Esta acción no se puede deshacer.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {action === 'reject' && rejectReason && (
            <div className="my-4 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm font-medium text-red-800">Motivo de rechazo:</p>
              <p className="text-sm text-red-700 mt-1">{rejectReason}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              variant={action === 'approve' ? 'default' : 'destructive'}
              className={action === 'approve' 
                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90 text-white' 
                : 'bg-gradient-to-r from-red-600 to-red-500 hover:bg-red-700 text-white'}
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  {action === 'approve' ? 'Aprobando...' : 'Rechazando...'}
                </div>
              ) : (
                action === 'approve' ? 'Sí, aprobar' : 'Sí, rechazar'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};