import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
import { Badge } from "@/common/ui/badge";
import { DialogContent, DialogFooter, Dialog } from "@/common/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { MapPin, Mail, X, Coffee, MessageSquare } from "@/common/ui/icons";
import { GoToButton } from "@/common/atoms/map/GoToButton";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ReviewsWidget } from "@/common/widgets/coffeelover/reviews/reviews_widget";

interface detailsProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  details: ApprovedBranch;
}

export const DialogDetailStores = ({ details, setIsOpen }: detailsProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  return (
    <>
      <DialogContent
        aria-describedby={undefined}
        className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw] 
          h-[73vh] sm:h-[90vh] bg-[#FBF7F4] shadow-xl border-none rounded-2xl p-0 overflow-hidden 
          flex flex-col"
      >
        <DialogTitle className="hidden"></DialogTitle>

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full 
            hover:bg-white transition-all duration-300 text-[#5F4B32] hover:text-[#8B5A2B]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative w-full h-48 sm:h-56 md:h-60 overflow-hidden flex-shrink-0">
          <div
            className={`absolute inset-0 bg-[#8B5A2B]/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ${
              imageLoaded ? "opacity-0" : "opacity-100"
            }`}
          >
            <Coffee className="h-10 w-10 text-[#8B5A2B] animate-pulse" />
          </div>
          <img
            src={details.store_logo || "/placeholder.svg"}
            alt={details.name}
            onLoad={() => setImageLoaded(true)}
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {details.name}
            </h2>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 space-y-5">
            {/* Store information */}
            <div className="space-y-4">
              <h3 className="font-medium text-[#5F4B32] text-base sm:text-lg flex items-center gap-2 border-b border-[#E6D7C3] pb-2">
                <Coffee className="h-5 w-5 text-[#8B5A2B]" />
                <span>Información de la tienda</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Address */}
                <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB8935]/10 transition-transform duration-300 group-hover:scale-150" />
                  <div className="relative flex items-start gap-4">
                    <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                      <MapPin className="h-5 w-5 text-[#DB8935]" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="block font-medium text-[#5F4B32]">
                        Dirección
                      </span>
                      <p className="text-sm text-gray-600/90 leading-relaxed">
                        {details.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB8935]/10 transition-transform duration-300 group-hover:scale-150" />
                  <div className="relative flex items-start gap-4">
                    <div className="rounded-full bg-[#DB8935]/10 p-2.5">
                      <Mail className="h-5 w-5 text-[#DB8935]" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="block font-medium text-[#5F4B32]">
                        Email
                      </span>
                      <p className="text-sm text-gray-600/90 leading-relaxed break-all">
                        {details.store_email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[#5F4B32]">
                Especialidades
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[#F5E4D2] text-[#8B5A2B] hover:bg-[#EAD7C1]">
                  Café de especialidad
                </Badge>
                <Badge className="bg-[#F5E4D2] text-[#8B5A2B] hover:bg-[#EAD7C1]">
                  Postres artesanales
                </Badge>
                <Badge className="bg-[#F5E4D2] text-[#8B5A2B] hover:bg-[#EAD7C1]">
                  Ambiente acogedor
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 sm:px-6 py-4 border-t border-[#E6D7C3]/50 mt-auto flex-shrink-0 
          flex flex-col sm:flex-row gap-3 sm:gap-4 bg-[#FBF7F4]">
          {/* Botón de reseñas - Ajustado para coincidir con GoToButton */}
          <div className="flex-1 order-2 sm:order-1">
            <button
              onClick={() => setReviewsOpen(true)}
              className="w-full bg-white border border-[#DB8935] text-[#DB8935] rounded-full 
                font-medium hover:bg-[#DB8935]/5 transition-all duration-300 transform hover:scale-105 
                shadow-md hover:shadow-lg flex items-center justify-center gap-2 py-2.5 px-4 h-[42px]"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Ver reseñas</span>
            </button>
          </div>

          {/* Botón de visitar */}
          <div className="flex-1 order-1 sm:order-2">
            <GoToButton
              text={details.name}
              branchId={details.id}
              mapRoute="private"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Modal de Reseñas - Corregido */}
      <Dialog open={reviewsOpen} onOpenChange={setReviewsOpen}>
        <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[65vw] lg:w-[55vw] xl:w-[50vw] 
          max-h-[85vh] bg-[#FBF7F4] shadow-xl border-none rounded-2xl p-0 overflow-hidden flex flex-col">
          <DialogTitle className="sr-only">Reseñas de {details.name}</DialogTitle>
          
          {/* Encabezado fijo */}
          <div className="p-4 sm:p-6 border-b border-[#E6D7C3]/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#DB8935]/10 p-1.5 rounded-full">
                  <MessageSquare className="h-5 w-5 text-[#DB8935]" />
                </div>
                <h2 className="font-medium text-[#5F4B32] text-lg truncate">
                  Reseñas de{" "}
                  <span className="font-semibold">{details.name}</span>
                </h2>
              </div>
              
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-4 sm:p-6">
            <ReviewsWidget branchId={details.id} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
