import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, 
  DialogFooter, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import { 
  MapPin, Phone, CalendarClock, CheckCircle2, XCircle, 
  Loader2, AlertCircle, Coffee 
} from "lucide-react";
import { CriteriaItem } from './criteria_item.molecule';
import { useBranchApprovalDetails } from '@/api/queries/branches/branch.query';

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

  if (!isOpen) return null;

  // Determinar colores basados en estado
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

  // Formatear fecha
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-[650px] border-0 shadow-lg bg-white rounded-lg overflow-hidden z-50">
        <div className="relative max-h-[75vh]  flex flex-col">
          <DialogHeader className="bg-gradient-to-r from-[#F3D19E]/20 to-[#D4A76A]/10 p-4 border-b border-amber-100">
            <DialogTitle className="text-[#6F4E37] flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-600" />
              Detalles de solicitud
              {data?.status && getStatusBadge(data.status)}
            </DialogTitle>
            <DialogDescription>
              Revisa los criterios y datos de la sucursal para tomar una decisión
            </DialogDescription>
          </DialogHeader>
          
          <div className=" max-h-[60vh] overflow-y-auto p-4 flex-1 scrollbar-coffee bg-white">
            {isLoading ? (
              <div className="py-10 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                  <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
                </div>
                <p className="text-gray-700 font-medium">Cargando detalles</p>
                <p className="text-gray-500 text-sm mt-1">Por favor espera mientras obtenemos la información</p>
              </div>
            ) : error ? (
              <div className="py-10 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-gray-700 font-medium">Error al cargar los detalles</p>
                <p className="text-gray-500 text-sm mt-1">
                  No pudimos obtener la información. Intenta nuevamente.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
              </div>
            ) : !data ? (
              <div className="py-10 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium">No hay datos disponibles</p>
                <p className="text-gray-500 text-sm mt-1">
                  No se encontraron detalles para esta sucursal.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-amber-100 bg-[#FFF8EE]/60 p-4 mb-4">
                  <h3 className="text-xl font-bold text-[#6F4E37] mb-2">{data.branch.name}</h3>
                  
                  <div className="flex items-center text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-amber-500" />
                    <span className="text-sm">{data.branch.address}</span>
                  </div>
                  
                  {data.branch.phoneNumber && (
                    <div className="flex items-center text-gray-700 mb-2">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-amber-500" />
                      <span className="text-sm">{data.branch.phoneNumber}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-700">
                    <CalendarClock className="h-4 w-4 mr-2 flex-shrink-0 text-amber-500" />
                    <span className="text-sm">
                      Solicitado el {formatDate(data.updatedAt)}
                    </span>
                  </div>
                </div>
                
                <h4 className="font-medium text-[#6F4E37] mb-3 flex items-center bg-[#FFF8EE] p-2 rounded-md border-l-4 border-amber-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M9 11l3 3L22 4" stroke="#D4A76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#D4A76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Criterios de evaluación
                </h4>
                
                <div className="space-y-3 mb-4">
                  {data.criteriaResponses.map((response, index) => (
                    <CriteriaItem key={index} criteriaResponse={response} />
                  ))}
                </div>
                
                {data.comments && (
                  <>
                    <h4 className="font-medium text-[#6F4E37] mb-2">Comentarios adicionales</h4>
                    <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 mb-4">
                      {data.comments}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          
          <DialogFooter className="p-4 border-t border-amber-100 bg-gradient-to-r from-amber-50/30 to-amber-100/20">
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 border-gray-200"
              >
                Cerrar
              </Button>
              
              {data?.status === 'PENDING' && !isLoading && !error && (
                <>
                  {/* <Button 
                    variant="destructive"
                    onClick={() => branchId && onReject(branchId)}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Rechazar
                  </Button> */}
                  <Button 
                    variant="default"
                    onClick={() => branchId && onApprove(branchId)}
                    className="flex-1 bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] text-white hover:opacity-90"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Aprobar
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};