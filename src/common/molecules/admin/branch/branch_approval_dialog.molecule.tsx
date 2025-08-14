import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, 
  DialogFooter, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import { Loader2, AlertCircle, Coffee, MapPin, Phone, CalendarClock, CheckCircle2, 
} from'@/common/ui/icons';
import { CriteriaItem } from './criteria_item.molecule';
import { useBranchApprovalDetails } from '@/api/queries/branches/branch.query';
import ImageViewer from '@/common/atoms/reviews/image_viewer.atom';

interface CriteriaItemModernProps {
  criteriaResponse: any;
  onImageClick: (imageUrl: string) => void;
}

const CriteriaItemModern: React.FC<CriteriaItemModernProps> = ({
  criteriaResponse,
  onImageClick
}) => {
  const responseText = criteriaResponse?.responseText || "";
  
  const isAffirmative = 
    responseText.toLowerCase?.() === "yes" || 
    responseText.toLowerCase?.() === "si" || 
    responseText.toLowerCase?.() === "sí" ||
    responseText.toLowerCase?.() === "true";
  
  const hasCriteria = criteriaResponse?.criteria?.name != null;
  
  if (!hasCriteria) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <div className="font-medium text-gray-500">Criterio no disponible</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5D5C8]/20 rounded-2xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h5 className="font-semibold text-[#4A3B2F] text-base mb-1">
            {criteriaResponse.criteria.name}
          </h5>
          {criteriaResponse.criteria.description && (
            <p className="text-sm text-[#7A5A3F] opacity-70">
              {criteriaResponse.criteria.description}
            </p>
          )}
        </div>
      </div>

      <div
        className={`p-3 rounded-xl text-sm mb-4 ${
          isAffirmative
            ? "bg-green-50 text-green-600 border border-green-100"
            : "bg-[#F8F6F4] text-[#7A5A3F] border border-[#E5D5C8]/20"
        }`}
      >
        {isAffirmative ? (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Cumple con este criterio
          </span>
        ) : (
          responseText || "Sin respuesta"
        )}
      </div>

      {criteriaResponse.imageUrl && (
        <div
          className="relative aspect-video bg-gray-50 rounded-xl overflow-hidden cursor-pointer group border border-gray-100"
          onClick={() => onImageClick(criteriaResponse.imageUrl)}
        >
          <img
            src={criteriaResponse.imageUrl}
            alt={criteriaResponse.criteria?.name || "Evidencia"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400?text=Imagen+No+disponible";
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <svg className="h-6 w-6 text-[#4A3B2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white text-xs font-medium">Click para ampliar la imagen</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface BranchApprovalDialogProps {
  branchId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (branchId: number) => void;
  onReject: (branchId: number) => void;
}

export const BranchApprovalDialog: React.FC<BranchApprovalDialogProps> = ({
  branchId,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const { data, isLoading, error } = useBranchApprovalDetails(branchId || undefined);
  const [imageViewer, setImageViewer] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0
  });

  if (!isOpen) return null;

  const allImages = data?.criteriaResponses
    ?.filter(response => response.imageUrl)
    .map(response => response.imageUrl)
    .filter((url): url is string => url !== null) || [];

  const openImageViewer = (imageUrl: string) => {
    const imageIndex = allImages.indexOf(imageUrl);
    setImageViewer({
      isOpen: true,
      images: allImages,
      currentIndex: imageIndex >= 0 ? imageIndex : 0
    });
  };

  const closeImageViewer = () => {
    setImageViewer(prev => ({ ...prev, isOpen: false }));
  };

  const nextImage = () => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: {[key: string]: { bg: string, text: string, label: string }} = {
      PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pendiente' },
      APPROVED: { bg: 'bg-green-50', text: 'text-green-700', label: 'Aprobada' },
      REJECTED: { bg: 'bg-red-50', text: 'text-red-700', label: 'Rechazada' }
    };
    
    const style = statusMap[status] || { bg: 'bg-gray-50', text: 'text-gray-700', label: status };
    
    return (
      <Badge variant="outline" className={`${style.bg} ${style.text} font-normal`}>
        {style.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[1100px] h-[90vh] border-0 shadow-xl bg-white rounded-2xl z-50 p-0 flex flex-col">
          <DialogHeader className="bg-gradient-to-r from-[#F8F6F4] to-[#F2E8D8] p-6 border-b border-[#E5D5C8]/20 shrink-0 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {data?.branch?.store_logo ? (
                    <div className="h-14 w-14 rounded-xl bg-white/80 shadow-sm overflow-hidden border border-[#E5D5C8]/30">
                      <img 
                        src={data.branch.store_logo} 
                        alt={data.branch.store_name || 'Logo de la tienda'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="h-14 w-14 rounded-xl bg-white/80 shadow-sm flex items-center justify-center"><svg class="h-8 w-8 text-[#7A5A3F]" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm10 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-5 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg></div>';
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-white/80 shadow-sm flex items-center justify-center">
                      <Coffee className="h-8 w-8 text-[#7A5A3F]" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-[#7A5A3F] opacity-90">
                      {data?.branch?.store_name || 'Tienda'}
                    </h2>
                    <span className="text-[#7A5A3F] opacity-60">•</span>
                    <span className="text-sm font-medium text-[#7A5A3F] opacity-70 bg-white/40 px-2 py-0.5 rounded-lg">
                      {data?.branch?.store_email || 'Sin email'}
                    </span>
                  </div>
                  
                  <DialogTitle className="text-2xl font-bold text-[#4A3B2F] mb-1">
                    Sucursal: {data?.branch?.name || 'Sin nombre'}
                  </DialogTitle>
                  
                  <DialogDescription className="text-[#7A5A3F] text-base opacity-80">
                    Revisa los criterios y datos para aprobar esta sucursal
                  </DialogDescription>
                </div>
              </div>
              {data?.status && getStatusBadge(data.status)}
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto bg-white" style={{ minHeight: 0 }}>
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-[#F8F6F4] flex items-center justify-center mb-4 mx-auto">
                    <Loader2 className="h-10 w-10 text-[#7A5A3F] animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#4A3B2F] mb-2">Cargando detalles</h3>
                  <p className="text-[#7A5A3F] opacity-70">Obteniendo información de la sucursal...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle className="h-10 w-10 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Error al cargar</h3>
                  <p className="text-gray-500 mb-6">No pudimos obtener la información. Intenta nuevamente.</p>
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={onClose}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            ) : !data ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin datos</h3>
                  <p className="text-gray-500 mb-6">No se encontraron detalles para esta sucursal.</p>
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-[#F8F6F4] to-[#F2E8D8] rounded-2xl p-6 border border-[#E5D5C8]/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#4A3B2F]">Información de la Sucursal</h3>
                      <p className="text-sm text-[#7A5A3F] opacity-70 mt-1">Datos proporcionados por la tienda</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-start gap-3 col-span-full sm:col-span-1">
                      <div className="p-1.5 bg-white/60 rounded-xl mt-0.5">
                        <svg className="h-4 w-4 text-[#7A5A3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[#4A3B2F] text-sm">Tienda</p>
                        <p className="text-[#7A5A3F] opacity-80 font-semibold">{data.branch.store_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 col-span-full sm:col-span-1">
                      <div className="p-1.5 bg-white/60 rounded-xl mt-0.5">
                        <svg className="h-4 w-4 text-[#7A5A3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[#4A3B2F] text-sm">Email</p>
                        <p className="text-[#7A5A3F] opacity-80 break-all text-sm">{data.branch.store_email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 col-span-full sm:col-span-2">
                      <div className="p-1.5 bg-white/60 rounded-xl mt-0.5">
                        <svg className="h-4 w-4 text-[#7A5A3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[#4A3B2F] text-sm">Nombre de la Sucursal</p>
                        <p className="text-[#7A5A3F] opacity-80 font-semibold">{data.branch.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 col-span-full">
                      <div className="p-1.5 bg-white/60 rounded-xl mt-0.5">
                        <MapPin className="h-4 w-4 text-[#7A5A3F]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#4A3B2F] text-sm">Dirección</p>
                        <p className="text-[#7A5A3F] opacity-80">{data.branch.address}</p>
                      </div>
                    </div>
                    
                    {data.branch.phoneNumber && (
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-white/60 rounded-xl mt-0.5">
                          <Phone className="h-4 w-4 text-[#7A5A3F]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#4A3B2F] text-sm">Teléfono</p>
                          <p className="text-[#7A5A3F] opacity-80">{data.branch.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-white/60 rounded-xl mt-0.5">
                        <CalendarClock className="h-4 w-4 text-[#7A5A3F]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#4A3B2F] text-sm">Fecha de solicitud</p>
                        <p className="text-[#7A5A3F] opacity-80">{formatDate(data.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#F8F6F4] rounded-xl">
                      <CheckCircle2 className="h-5 w-5 text-[#7A5A3F]" />
                    </div>
                    <h4 className="text-lg font-semibold text-[#4A3B2F]">Criterios de evaluación</h4>
                  </div>
                  
                  <div className="grid gap-4">
                    {data.criteriaResponses.map((response, index) => (
                      <CriteriaItemModern 
                        key={index} 
                        criteriaResponse={response} 
                        onImageClick={openImageViewer}
                      />
                    ))}
                  </div>
                </div>
                
                {data.comments && (
                  <div>
                    <h4 className="text-lg font-semibold text-[#4A3B2F] mb-3">Comentarios adicionales</h4>
                    <div className="bg-[#F8F6F4] border border-[#E5D5C8]/20 rounded-2xl p-4">
                      <p className="text-[#7A5A3F] leading-relaxed opacity-80">{data.comments}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        
        <DialogFooter className="p-6 border-t border-[#E5D5C8]/20 bg-[#F8F6F4] shrink-0 rounded-b-2xl">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-[#E5D5C8] text-[#7A5A3F] hover:bg-[#F2E8D8]/50 rounded-xl"
            >
              Cerrar
            </Button>
            
            {data?.status === 'PENDING' && !isLoading && !error && (
              <Button 
                variant="default"
                onClick={() => branchId && onApprove(branchId)}
                className="flex-1 bg-gradient-to-r from-[#C8A882] to-[#7A5A3F] text-white hover:opacity-90 rounded-xl shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aprobar Sucursal
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {imageViewer.isOpen && (
      <ImageViewer
        images={imageViewer.images}
        currentIndex={imageViewer.currentIndex}
        isOpen={imageViewer.isOpen}
        onClose={closeImageViewer}
        onNext={nextImage}
        onPrev={prevImage}
      />
    )}
  </>
);
};