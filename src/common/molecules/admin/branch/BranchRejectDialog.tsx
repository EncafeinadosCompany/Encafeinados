import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Textarea } from "@/common/ui/textarea";
import { Label } from "@/common/ui/label";
import { XCircle, RefreshCw } from "lucide-react";

interface BranchRejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (branchId: number, reason: string) => void;
  branchId: number | null;
  branchName?: string;
  isSubmitting?: boolean;
}

export const BranchRejectDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  branchId,
  branchName,
  isSubmitting = false
}: BranchRejectDialogProps) => {
  const [reason, setReason] = React.useState('');
  const isValid = reason.trim().length >= 10;

  const handleSubmit = () => {
    if (branchId && isValid) {
      onConfirm(branchId, reason);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setReason('');
      }
    }}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent opacity-70 pointer-events-none"></div>
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-red-600">Rechazar Sucursal</DialogTitle>
            <DialogDescription>
              {branchName ? (
                <>Estás rechazando la sucursal <span className="font-medium">{branchName}</span>.</>
              ) : (
                'Estás rechazando esta sucursal.'
              )}
              <br />
              Por favor, indica el motivo para comunicarlo al solicitante.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Motivo de rechazo <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explique por qué se rechaza esta solicitud..."
                className="min-h-[120px] resize-none focus-visible:ring-red-400"
              />
              {reason.trim().length > 0 && reason.trim().length < 10 && (
                <p className="text-sm text-red-500">El motivo debe tener al menos 10 caracteres</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                  setReason('');
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="button"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!isValid || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Rechazando...
                  </div>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Confirmar rechazo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};