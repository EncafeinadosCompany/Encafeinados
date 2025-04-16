import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { CriteriaResponse } from "@/api/types/branchesApprovalTypes";
import { ZoomIn, X, Check, AlertCircle } from "lucide-react";

interface CriteriaItemProps {
  criteriaResponse: CriteriaResponse;
}

export const CriteriaItem: React.FC<CriteriaItemProps> = ({
  criteriaResponse,
}) => {
  const [showFullImage, setShowFullImage] = useState(false);

  const responseText = criteriaResponse?.responseText || "";
  
  const isAffirmative = 
    responseText.toLowerCase?.() === "yes" || 
    responseText.toLowerCase?.() === "si" || 
    responseText.toLowerCase?.() === "sí" ||
    responseText.toLowerCase?.() === "true";
  
    const hasCriteria = criteriaResponse?.criteria?.name != null;
  
  if (!hasCriteria) {
    return (
      <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <div className="font-medium text-gray-500">Criterio no disponible</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-[#FFF8EE] rounded-md border border-[#F3D19E]/30">
      <div className="font-medium text-[#6F4E37] mb-1">
        {criteriaResponse.criteria.name}
      </div>
      
      {criteriaResponse.criteria.description && (
        <div className="text-xs text-gray-600 mb-2">
          {criteriaResponse.criteria.description}
        </div>
      )}

      <div
        className={`p-2 rounded text-sm mb-2 ${
          isAffirmative
            ? "bg-green-50 text-green-700 border border-green-100"
            : "bg-white text-gray-800 border border-gray-100"
        }`}
      >
        {isAffirmative ? (
          <span className="flex items-center">
            <Check className="h-4 w-4 mr-1" />
            Cumple con este criterio
          </span>
        ) : (
          responseText || "Sin respuesta"
        )}
      </div>

      {criteriaResponse.imageUrl && (
        <>
          <div
            className="relative h-32 bg-gray-100 rounded overflow-hidden cursor-pointer border border-gray-200 group"
            onClick={() => setShowFullImage(true)}
          >
            <img
              src={criteriaResponse.imageUrl}
              alt={criteriaResponse.criteria?.name || "Vista previa"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400?text=Imagen+No+disponible";
              }}
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

          {showFullImage && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-black opacity-80" 
                onClick={() => setShowFullImage(false)}
              />
              
              <div className="relative z-10 max-w-[90%] max-h-[90%] bg-white rounded-lg shadow-2xl overflow-hidden mx-auto my-auto">
                <button
                  className="absolute top-2 right-2 z-20 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 transition-colors"
                  onClick={() => setShowFullImage(false)}
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="bg-gray-100 w-full h-full flex items-center justify-center p-4">
                  <img
                    src={criteriaResponse.imageUrl}
                    alt={criteriaResponse.criteria?.name || "Imagen ampliada"}
                    className="max-w-full max-h-[70vh] object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/800x600?text=Imagen+no+disponible";
                    }}
                  />
                </div>

            
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
