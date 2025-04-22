import { Branch } from "@/api/types/branchesTypes"
import { DialogHeader, Dialog, DialogContent, DialogTitle } from "@/common/ui/dialog"
import {  Mail, MapPin, X, Phone, Star, Store, Globe } from "@/common/ui/icons"

interface DetailsBranchModalProps {
  isOpen: boolean
  onClose: () => void
  branch: Branch
}

export function BranchDetails({ isOpen, onClose, branch }: DetailsBranchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw] 
        max-h-[90vh] bg-white shadow-xl border-none rounded-lg p-4 sm:p-6 md:p-8">

        {/* Header with store name */}
        <DialogHeader className="pb-4 border-b border-[#E6D7C3]">
          <DialogTitle className="text-xl font-semibold text-[#5F4B32] flex items-center gap-2">
            <Store className="h-6 w-6 text-[#DB8935]" />
            Información de la {branch.name || branch.store_name || branch.store?.store_name || "Detalles de la Sucursal"}
          </DialogTitle>
        </DialogHeader>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full 
          hover:bg-white transition-all duration-300 text-[#5F4B32] hover:text-[#8B5A2B]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content area with scroll */}
        <div className="flex-grow overflow-y-auto custom-scrollbar max-h-[60vh] my-4">
          <div className="p-2 sm:p-6 space-y-6">
            {/* Store information */}
            <div className="space-y-2">
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

              {/* Address */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store Name */}


                {/* Email */}
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

                {/* Phone */}
                {branch.phone_number && (
                  <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                    <div className="relative flex items-start gap-4">
                      <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                        <Phone className="h-5 w-5 text-[#DB8935]" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block font-medium text-[#5F4B32]">Teléfono</span>
                        <p className="text-sm text-gray-600/90 leading-relaxed">{branch.phone_number}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {branch.average_rating && (
                  <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                    <div className="relative flex items-start gap-4">
                      <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                        <Star className="h-5 w-5 text-[#DB8935]" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block font-medium text-[#5F4B32]">Calificación</span>
                        <p className="text-sm text-gray-600/90 leading-relaxed">{branch.average_rating}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                  <div className="relative flex items-start gap-4">
                    <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                      <div className={`h-5 w-5 rounded-full ${branch.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                    <div className="space-y-1.5">
                      <span className="block font-medium text-[#5F4B32]">Estado</span>
                      <p className="text-sm text-gray-600/90 leading-relaxed capitalize">{branch.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            {branch.social_branches && branch.social_branches.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="font-medium text-[#5F4B32] text-base sm:text-lg flex items-center gap-2 border-b border-[#E6D7C3] pb-2">
                  <Globe className="h-5 w-5 text-[#8B5A2B]" />
                  <span>Redes Sociales</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branch.social_branches.map((social, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB8935]/10 transition-transform duration-300 group-hover:scale-150" />
                      <div className="relative flex items-start gap-4">
                        <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                          <Globe className="h-5 w-5 text-[#DB8935]" />
                        </div>
                        <div className="space-y-1.5">
                          <span className="block font-medium text-[#5F4B32] capitalize">{social.social_network_name ? social.social_network_name : "Red Social"}</span>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline leading-relaxed break-all"
                          >
                            {social.url}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Location */}
            {branch.latitude && branch.longitude && (
              <div className="space-y-4 mt-6">
                <h3 className="font-medium text-[#5F4B32] text-base sm:text-lg flex items-center gap-2 border-b border-[#E6D7C3] pb-2">
                  <MapPin className="h-5 w-5 text-[#8B5A2B]" />
                  <span>Ubicación</span>
                </h3>

                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                  <iframe
                      title="Branch Location"
                      width="100%"
                      height="100%"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${branch.longitude - 0.002}%2C${branch.latitude - 0.002}%2C${branch.longitude + 0.002}%2C${branch.latitude + 0.002}&layer=mapnik&marker=${branch.latitude}%2C${branch.longitude}`}
                      allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}