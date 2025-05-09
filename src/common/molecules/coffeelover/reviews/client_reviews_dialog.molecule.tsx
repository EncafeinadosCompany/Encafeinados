import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog";
import { X, User, MessageSquare } from 'lucide-react';
import ClientReviewsWidget from '@/common/widgets/coffeelover/reviews/client_reviews_widget';
import { Button } from '@/common/ui/button';

interface ClientReviewsDialogProps {
  clientId: number;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientReviewsDialog: React.FC<ClientReviewsDialogProps> = ({ 
  clientId, 
  clientName, 
  isOpen, 
  onClose 
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  useEffect(() => {
    const checkImageViewer = () => {
      const isActive = document.body.classList.contains('image-viewer-active');
      setIsImageViewerOpen(isActive);
    };
    
    checkImageViewer();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkImageViewer();
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isImageViewerOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="w-full max-w-[30%] sm:max-w-[30%] md:max-w-[30%] lg:max-w-[30%] max-h-[90vh] overflow-hidden p-0 gap-0 z-[20000]"
        style={{ position: 'fixed', background: 'white' }}
        onInteractOutside={(e) => {
          if (isImageViewerOpen) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isImageViewerOpen) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="bg-gradient-to-r from-amber-700 to-amber-600 text-white sticky top-0 z-10 p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="bg-white/20 rounded-full p-1">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <div>
                <DialogTitle className="text-sm sm:text-base font-medium">Mis Reseñas</DialogTitle>
                <p className="text-white/80 text-xs mt-0.5 flex items-center">
                  <User className="h-2.5 w-2.5 mr-1" />
                  {clientName}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => !isImageViewerOpen && onClose()}
              className="rounded-full h-6 w-6 text-white hover:bg-white/20 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
          <div className="p-2 sm:p-3">
            <ClientReviewsWidget clientId={clientId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientReviewsDialog;