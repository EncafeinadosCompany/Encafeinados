import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/common/ui/dialog";
import { MessageSquare } from '@/common/ui/icons';
import ReviewsWidget from '@/common/widgets/coffeelover/reviews/reviews_widget';

interface ReviewsDialogProps {
  branchId: string | number;
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
        className="w-[100vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw]
        max-w-none sm:max-w-7xl h-[calc(100vh-40px)] sm:h-[96vh] max-h-[calc(100vh-20px)] sm:max-h-[96vh] 
        bg-[#FBF7F4] shadow-xl border-none rounded-t-2xl sm:rounded-2xl p-0 overflow-hidden flex flex-col z-[20000]
        mt-[20px] sm:mt-0"
      >
        <DialogTitle className="sr-only">
          Reseñas de {branchName}
        </DialogTitle>

        <div className="p-4 sm:p-6 border-b border-[#E6D7C3]/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#DB8935]/10 p-1.5 rounded-full">
                <MessageSquare className="h-5 w-5 text-[#DB8935]" />
              </div>
              <h2 className="font-medium text-[#5F4B32] text-lg truncate">
                Reseñas de{" "}
                <span className="font-semibold">{branchName}</span>
              </h2>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-amber-400/30 scrollbar-track-transparent p-4 sm:p-6">
          <ReviewsWidget branchId={branchId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewsDialog;