import { Branch } from "@/api/types/branches/branches.types"
import { DialogHeader, Dialog, DialogContent, DialogTitle } from "@/common/ui/dialog"
import { Mail, MapPin, X, Phone, Star, Store, Globe } from "@/common/ui/icons"
import { useState } from "react"

interface DetailsBranchModalProps {
  isOpen: boolean
  onClose: () => void
  branch: Branch
}

export function BranchDetails({ isOpen, onClose, branch }: DetailsBranchModalProps) {
  const [isMapLoading, setIsMapLoading] = useState(true)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="w-[98vw] sm:w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] 2xl:w-[75vw] 
         max-w-7xl h-[85vh] sm:max-h-[90vh] bg-white shadow-xl border-none rounded-lg p-4 sm:p-6 md:p-8">

        <DialogHeader className="pb-4 border-b border-[#E6D7C3]">
          <DialogTitle className="sm:text-xl font-semibold text-[#5F4B32] flex items-center gap-2">
            <Store className="h-6 w-6 text-[#DB8935]" />
            Información de {branch.name || branch.store_name || branch.store?.store_name || "Detalles de la Sucursal"}
          </DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full 
          hover:bg-white transition-all duration-300 text-[#5F4B32] hover:text-[#8B5A2B]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-grow overflow-y-auto custom-scrollbar max-h-[75vh] my-4">
          <div className="p-2 sm:p-6 space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <h3 className="font-medium text-[#5F4B32] text-base sm:text-lg flex items-center gap-2 border-b border-[#E6D7C3] pb-2">
                  <Store className="h-5 w-5 text-[#8B5A2B]" />
                  <span>Información Básica</span>
                </h3>

                {(branch.store_name || branch.store?.store_name) && (
                  <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB8935]/10 transition-transform duration-300 group-hover:scale-150" />
                    <div className="relative flex items-start gap-4">
                      <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                        <Store className="h-5 w-5 text-[#DB8935]" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block font-medium text-[#5F4B32]">Nombre de Tienda</span>
                        <p className="text-sm text-gray-600/90 leading-relaxed">{branch.store_name || branch.store?.store_name}</p>
                      </div>
                    </div>
                  </div>
                )}

            
                {branch.address && (
                  <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB8935]/10 transition-transform duration-300 group-hover:scale-150" />
                    <div className="relative flex items-start gap-4">
                      <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                        <MapPin className="h-5 w-5 text-[#DB8935]" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block font-medium text-[#5F4B32]">Dirección</span>
                        <p className="text-sm text-gray-600/90 leading-relaxed">{branch.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {branch.store?.store_email && (
                  <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                    <div className="relative flex items-start gap-4">
                      <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                        <Mail className="h-5 w-5 text-[#DB8935]" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block font-medium text-[#5F4B32]">Email</span>
                        <p className="text-sm text-gray-600/90 leading-relaxed break-all">{branch.store?.store_email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {branch.phone_number && (
                  <a 
                    href={`tel:${branch.phone_number}`}
                    className="block group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative flex items-start gap-4">
                      <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                        <Phone className="h-5 w-5 text-[#DB8935]" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block font-medium text-[#5F4B32]">Teléfono</span>
                        <p className="text-sm text-gray-600/90 leading-relaxed">{branch.phone_number}</p>
                      </div>
                    </div>
                  </a>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {branch.average_rating && (
                    <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                      <div className="relative flex items-start gap-4">
                        <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                          <Star className="h-5 w-5 text-[#DB8935]" />
                        </div>
                        <div className="space-y-1.5">
                          <span className="block font-medium text-[#5F4B32]">Calificación</span>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600/90">{branch.average_rating}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${
                                    i < Math.floor(parseFloat(branch.average_rating || '0')) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                    <div className="relative flex items-start gap-4">
                      <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                        <div className={`h-5 w-5 rounded-full ${
                          branch.status === 'APPROVED' || branch.status === 'active' ? 'bg-green-500' : 
                          branch.status === 'PENDING' ? 'bg-yellow-500' : 
                          branch.status === 'REJECTED' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block font-medium text-[#5F4B32]">Estado</span>
                        <p className={`text-sm leading-relaxed font-medium ${
                          branch.status === 'APPROVED' || branch.status === 'active' ? 'text-green-600' : 
                          branch.status === 'PENDING' ? 'text-yellow-600' : 
                          branch.status === 'REJECTED' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {branch.status === 'PENDING' ? 'Pendiente' :
                           branch.status === 'APPROVED' ? 'Aprobado' :
                           branch.status === 'REJECTED' ? 'Rechazado' :
                           branch.status === 'active' ? 'Activo' :
                           branch.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                
                {branch.social_branches && branch.social_branches.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-[#5F4B32] text-base sm:text-lg flex items-center gap-2 border-b border-[#E6D7C3] pb-2">
                      <Globe className="h-5 w-5 text-[#8B5A2B]" />
                      <span>Redes Sociales</span>
                    </h3>

                    <div className="space-y-4">
                      {branch.social_branches.map((social, index) => (
                        <a
                          key={index}
                          href={social.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                        >
                          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB8935]/10 transition-transform duration-300 group-hover:scale-150" />
                          <div className="relative flex items-start gap-4">
                            <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                              <Globe className="h-5 w-5 text-[#DB8935]" />
                            </div>
                            <div className="space-y-1.5">
                              <span className="block font-medium text-[#5F4B32] capitalize">{social.description || "Red Social"}</span>
                              <p className="text-xs text-gray-500 truncate">{social.value}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {branch.latitude && branch.longitude && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-[#5F4B32] text-base sm:text-lg flex items-center gap-2 border-b border-[#E6D7C3] pb-2">
                      <MapPin className="h-5 w-5 text-[#8B5A2B]" />
                      <span>Ubicación</span>
                    </h3>

                    <div className="relative aspect-square lg:aspect-video w-full rounded-xl overflow-hidden shadow-md">
                      {isMapLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#F8F4F0]">
                          <div className="w-8 h-8 border-4 border-[#DB8935]/30 border-t-[#DB8935] rounded-full animate-spin"></div>
                        </div>
                      )}
                      <iframe
                        onLoad={() => setIsMapLoading(false)}
                        title="Branch Location"
                        width="100%"
                        height="100%"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${branch.longitude - 0.01}%2C${branch.latitude - 0.01}%2C${branch.longitude + 0.01}%2C${branch.latitude + 0.01}&layer=mapnik&marker=${branch.latitude}%2C${branch.longitude}&zoom=12`}
                        allowFullScreen
                        style={{ border: 'none', filter: 'contrast(0.9) saturate(0.6) brightness(1.1)' }}
                      ></iframe>
                    </div>

                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-sm bg-[#DB8935]/10 text-[#DB8935] hover:bg-[#DB8935]/20 transition-colors"
                    >
                      <MapPin className="h-4 w-4" /> Ver en Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}