import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Textarea } from "@/common/ui/textarea";
import { Label } from "@/common/ui/label";
import { UseFormReturn } from 'react-hook-form';

interface RejectFormData {
  reason: string;
}

interface StoreRejectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RejectFormData) => void;
  form: UseFormReturn<RejectFormData>; // Acepta el objeto completo
}

export const StoreRejectDialog = ({ open, onClose, onSubmit, form }: StoreRejectDialogProps) => {
  // Ahora puedes usar form directamente
  const { register, handleSubmit, formState, reset } = form;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        onClose();
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
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
              {formState.errors.reason && (
                <p className="text-sm text-red-500">{formState.errors.reason.message}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                  reset();
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!formState.isValid}
              >
                Continuar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};