import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog";
import { X, Coffee, MessageSquare } from'@/common/ui/icons'
import ReviewsWidget from '@/common/widgets/coffeelover/reviews/reviews_widget';
import { Button } from '@/common/ui/button';

interface ReviewsDialogProps {
  branchId: number;
  branchName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsDialog: React.FC<ReviewsDialogProps> = ({ 
  branchId, 
  branchName, 
  isOpen, 
  onClose 
}) => {
  // Función de cierre estable
  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  // Control de apertura/cierre más simple
  const handleOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden p-0 gap-0 z-[20000]"
        style={{ position: 'fixed', background: 'white' }}
      >
        <DialogHeader className="bg-gradient-to-r from-amber-700 to-amber-600 text-white sticky top-0 z-10 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 rounded-full p-1.5">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-medium">Reseñas</DialogTitle>
                <p className="text-white/80 text-xs sm:text-sm mt-0.5 flex items-center">
                  <Coffee className="h-3 w-3 mr-1" />
                  {branchName}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="rounded-full h-8 w-8 text-white hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-4 sm:p-6">
            <ReviewsWidget branchId={branchId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewsDialog;