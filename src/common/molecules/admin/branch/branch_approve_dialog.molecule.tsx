import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { RefreshCw, CheckCircle2 } from'@/common/ui/icons';

interface BranchApproveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (branchId: number) => void;
  branchId: number | null;
  branchName?: string;
  isSubmitting?: boolean;
}

export const BranchApproveDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  branchId,
  branchName,
  isSubmitting = false
}: BranchApproveDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent opacity-70 pointer-events-none"></div>
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-green-600">Aprobar Sucursal</DialogTitle>
            <DialogDescription>
              {branchName ? (
                <>
                  ¿Estás seguro de que deseas aprobar <span className="font-medium">{branchName}</span>?
                </>
              ) : (
                "¿Estás seguro de que deseas aprobar esta sucursal?"
              )}
              <br />
              La sucursal aparecerá inmediatamente en el mapa público.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              className="bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] hover:opacity-90 text-white"
              onClick={() => branchId && onConfirm(branchId)}
              disabled={isSubmitting || !branchId}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Aprobando...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Sí, aprobar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};