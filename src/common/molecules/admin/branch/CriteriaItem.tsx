import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter } from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { CriteriaResponse } from '@/api/types/branchesApprovalTypes';

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
            className="relative h-32 bg-gray-100 rounded overflow-hidden cursor-pointer border border-gray-200"
            onClick={() => setShowFullImage(true)}
          >
            <img 
              src={criteriaResponse.imageUrl} 
              alt={criteriaResponse.criteria.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-xs py-1 px-2">
              Click para ampliar
            </div>
          </div>
          
          {/* Modal para ver imagen completa */}
          <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
            <DialogContent className="sm:max-w-[90vw] p-2 max-h-[90vh]">
              <div className="relative h-[70vh] w-full flex items-center justify-center">
                <img
                  src={criteriaResponse.imageUrl}
                  alt={criteriaResponse.criteria.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <DialogFooter>
                <Button size="sm" onClick={() => setShowFullImage(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};