import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import { Skeleton } from "@/common/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/ui/avatar";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  X, 
  MapPin, 
  Phone, 
  User,
  Building2,
  Globe,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from "@/common/ui/icons";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
import { ApprovedBranch, RejectedBranch, PendingBranch } from '@/api/types/branches/branches_approval.types';
import { useBranchApprovalDetails, useBranchesID } from "@/api/queries/branches/branch.query";
import { useBranchAttributes } from "@/api/queries/branches/branch.query";

interface BranchDetailsModalProps {
  branch: ApprovedBranch | RejectedBranch | PendingBranch | null;
  onClose: () => void;
}

export const BranchDetailsModal: React.FC<BranchDetailsModalProps> = ({ branch, onClose }) => {
  const { data: approvalDetails, isLoading: loadingApproval } = useBranchApprovalDetails(branch?.id);
  const { data: attributes, isLoading: loadingAttributes } = useBranchAttributes(branch?.id);
  const { data: branchDetails, isLoading: loadingBranchDetails } = useBranchesID(branch?.id || 0);

  if (!branch) return null;

  const latitude = (branch as any).latitude || branchDetails?.branch?.latitude || approvalDetails?.branch?.latitude;
  const longitude = (branch as any).longitude || branchDetails?.branch?.longitude || approvalDetails?.branch?.longitude;
  const phoneNumber = (branch as any).phone_number || branchDetails?.branch?.phone_number;

  const branchType = branch.status.toLowerCase() as 'pending' | 'approved' | 'rejected';
  const statusConfig = {
    pending: {
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      icon: AlertCircle,
      label: 'Pendiente'
    },
    approved: {
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      label: 'Aprobada'
    },
    rejected: {
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      icon: XCircle,
      label: 'Rechazada'
    }
  };
  const config = statusConfig[branchType];
  const StatusIcon = config.icon;
  return (
    <Dialog open={!!branch} onOpenChange={onClose}>
      <DialogContent className="bg-[#FBF7F4] border-[#E6D7C3] shadow-2xl max-w-[90vw] w-full h-[90vh] flex flex-col overflow-hidden p-0">
        <div className={`${config.bgColor} border-b ${config.borderColor} p-6 flex-shrink-0`}>
          <DialogHeader className="!p-0 !block">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                  <AvatarImage src={branch.store_logo} alt={branch.name} />
                  <AvatarFallback className="bg-[#DB8935] text-white text-lg font-semibold">
                    {branch.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-[#5F4B32] mb-2">
                    {branch.name}
                  </DialogTitle>
                  <div className="flex items-center gap-3">
                    <Badge className={`${config.color} text-white font-medium`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="hover:bg-white/50 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button> */}
            </div>
          </DialogHeader>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs defaultValue="general" className="flex flex-col h-full">
            <TabsList className="grid grid-cols-3 bg-[#F5E4D2] mx-6 mt-4 mb-2 rounded-lg flex-shrink-0">
              <TabsTrigger value="general" className="text-sm cursor-pointer">Información General</TabsTrigger>
              <TabsTrigger value="location" className="text-sm cursor-pointer">Ubicación</TabsTrigger>
              <TabsTrigger value="approval" className="text-sm cursor-pointer">Aprobación</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="general" className="h-full overflow-auto">
                <div className="p-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                    <Card className="border-[#E6D7C3]">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-[#5F4B32] text-lg">
                          <Building2 className="w-6 h-6" />
                          Información Básica
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Dirección</p>
                            <p className="text-sm text-gray-600">{branch.address || 'No especificada'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Teléfono</p>
                            <p className="text-sm text-gray-600">
                              {phoneNumber || 'No especificado'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email de la tienda</p>
                            <p className="text-sm text-gray-600">{branch.store_email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-[#E6D7C3]">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-[#5F4B32] text-lg">
                          <Building2 className="w-6 h-6" />
                          Características
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loadingAttributes ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                              <Skeleton key={i} className="h-10 w-full" />
                            ))}
                          </div>
                        ) : attributes?.attributes?.length ? (
                          <div className="space-y-3">
                            {attributes.attributes.map((attr, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">{attr.attributeName}</span>
                                <Badge variant="outline" className="text-xs">{attr.value}</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-6">
                            No hay características registradas
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {(branch as any).social_branches?.length > 0 && (
                    <Card className="border-[#E6D7C3]">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-[#5F4B32] text-lg">
                          <Globe className="w-6 h-6" />
                          Redes Sociales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(branch as any).social_branches.map((social: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{social.social_network_name}</p>
                                <p className="text-xs text-gray-600">{social.description}</p>
                              </div>
                              {social.url && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="h-full overflow-auto">
                <div className="p-8">
                  <Card className="border-[#E6D7C3] h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#5F4B32] text-lg">
                        <MapPin className="w-6 h-6" />
                        Ubicación de la Sucursal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm font-medium text-amber-800 mb-2">Dirección Completa</p>
                        <p className="text-gray-700 text-base">{branch.address || 'Dirección no especificada'}</p>
                      </div>                     
                      {latitude && longitude ? (
                        <div className="space-y-4">
                          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                            <MapContainer
                              center={[latitude, longitude]}
                              zoom={15}
                              style={{ height: "100%", width: "100%" }}
                              zoomControl={true}
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <Marker position={[latitude, longitude]}>
                                <Popup>
                                  <div className="text-center">
                                    <h3 className="font-semibold text-[#5F4B32]">{branch.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
                                  </div>
                                </Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                              <p className="text-xs font-medium text-gray-600 mb-1">Latitud</p>
                              <p className="text-sm font-mono text-gray-800">{latitude}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                              <p className="text-xs font-medium text-gray-600 mb-1">Longitud</p>
                              <p className="text-sm font-mono text-gray-800">{longitude}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="lg"
                              onClick={() => window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank')}
                              className="flex items-center gap-2 w-full"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Abrir en Google Maps
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No hay coordenadas disponibles para mostrar el mapa</p>
                          <p className="text-gray-400 text-sm mt-2">La sucursal no tiene ubicación geográfica registrada</p>
                          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-700">
                              <strong>Información disponible:</strong><br/>
                              - Latitude: {latitude || 'No disponible'}<br/>
                              - Longitude: {longitude || 'No disponible'}<br/>
                              - Detalles cargados: {loadingBranchDetails ? 'Cargando...' : (branchDetails ? 'Sí' : 'No')}<br/>
                              - Aprobación cargada: {loadingApproval ? 'Cargando...' : (approvalDetails ? 'Sí' : 'No')}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="approval" className="h-full overflow-auto">
                <div className="p-8">
                  <Card className="border-[#E6D7C3]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#5F4B32] text-lg">
                        <CheckCircle className="w-6 h-6" />
                        Detalles de Aprobación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingApproval ? (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-24 w-full" />
                        </div>
                      ) : approvalDetails ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-2">Estado</p>
                              <Badge className={`${config.color} text-white`}>
                                {config.label}
                              </Badge>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-2">Última actualización</p>
                              <p className="text-sm text-gray-600">
                                {new Date(approvalDetails.updatedAt).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>

                          {approvalDetails.approvedBy && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-2">Aprobado por</p>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-600">{approvalDetails.approvedBy}</p>
                              </div>
                            </div>
                          )}

                          {approvalDetails.comments && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-2">Comentarios</p>
                              <p className="text-sm text-gray-600">{approvalDetails.comments}</p>
                            </div>
                          )}

                          {approvalDetails.criteriaResponses?.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="text-lg font-medium text-gray-900">Criterios de Evaluación</h4>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {approvalDetails.criteriaResponses.map((criteria, index) => (
                                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900 mb-2">
                                      {criteria.criteria.name}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-3">
                                      {criteria.criteria.description}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-3">
                                      {criteria.responseText}
                                    </p>                                    {criteria.imageUrl && (
                                      <div className="flex justify-center">
                                        <img
                                          src={criteria.imageUrl}
                                          alt="Evidencia"
                                          className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                                          onClick={() => criteria.imageUrl && window.open(criteria.imageUrl, '_blank')}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {('rejection_reason' in branch && branch.rejection_reason) && (
                            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-base font-medium text-red-800 mb-2">Motivo de Rechazo</p>
                                  <p className="text-red-700">{branch.rejection_reason}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No hay información de aprobación disponible</p>
                          <p className="text-gray-400 text-sm mt-2">Los detalles de aprobación no han sido cargados</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
