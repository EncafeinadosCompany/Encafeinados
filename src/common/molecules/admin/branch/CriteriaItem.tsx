import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogFooter, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { CriteriaResponse } from '@/api/types/branchesApprovalTypes';
import { ZoomIn, X } from 'lucide-react';

interface CriteriaItemProps {
  criteriaResponse: CriteriaResponse;
}

export const CriteriaItem: React.FC<CriteriaItemProps> = ({ criteriaResponse }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  
  // Determinar si la respuesta es afirmativa
  const isAffirmative = criteriaResponse.responseText.toLowerCase() === 'yes' || 
                        criteriaResponse.responseText.toLowerCase() === 'si' ||
                        criteriaResponse.responseText.toLowerCase() === 'sí';
  
  return (
    <div className="p-3 bg-[#FFF8EE] rounded-md border border-[#F3D19E]/30">
      <div className="font-medium text-[#6F4E37] mb-1">
        {criteriaResponse.criteria.name}
      </div>
      <div className="text-xs text-gray-600 mb-2">
        {criteriaResponse.criteria.description}
      </div>
      
      <div className={`p-2 rounded text-sm mb-2 ${
        isAffirmative 
          ? 'bg-green-50 text-green-700 border border-green-100' 
          : 'bg-white text-gray-800 border border-gray-100'
      }`}>
        {isAffirmative ? '✓ Cumple con este criterio' : criteriaResponse.responseText}
      </div>
      
      {criteriaResponse.imageUrl && (
        <>
          <div 
            className="relative h-32 bg-gray-100 rounded overflow-hidden cursor-pointer border border-gray-200 group"
            onClick={() => setShowFullImage(true)}
          >
            <img 
              src={criteriaResponse.imageUrl} 
              alt={criteriaResponse.criteria.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-2">
                <ZoomIn className="h-5 w-5 text-gray-700" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1.5 px-2 flex items-center">
              <ZoomIn className="h-3.5 w-3.5 mr-1" />
              Click para ampliar
            </div>
          </div>
          
          {/* Modal para ver imagen completa - MEJORADO CON FONDO Y CONTROLES */}
          <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
            <DialogOverlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
            <DialogContent className="fixed inset-0 z-50 bg-transparent border-0 p-0 flex items-center justify-center">
              <div className="relative max-w-[90vw] max-h-[90vh] bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 z-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
                  onClick={() => setShowFullImage(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
                
                <div className="p-2">
                  <img
                    src={criteriaResponse.imageUrl}
                    alt={criteriaResponse.criteria.name}
                    className="max-h-[80vh] max-w-[80vw] object-contain rounded"
                  />
                </div>
                
                <div className="bg-black/50 p-3 text-white text-center">
                  <p className="font-medium">{criteriaResponse.criteria.name}</p>
                  <p className="text-sm text-white/80">{criteriaResponse.responseText}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};