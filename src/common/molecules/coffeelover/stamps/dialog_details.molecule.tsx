import { StampsByClientResponse } from "@/api/types/album/stamps.types";
import { Badge } from "@/common/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog"

import { MapPin, Stamp, StarsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DetailsProps {
    users: StampsByClientResponse | null;
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    selectedStamp: any; 
}
export const CardStampsDetails = ({users, modalOpen, selectedStamp, setModalOpen}:DetailsProps) => {
    const navigate = useNavigate();
return(
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
    <DialogContent className="bg-white text-cream-50 border-none max-w-md  ">
        <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="text-orange-700 flex items-center gap-2">
                <Stamp className="h-5 w-5 text-orange-700" />
                {selectedStamp?.name || "Detalles del Sello"}
            </DialogTitle>

        </DialogHeader>
        <div className=" m-2  rounded-md p-4 shadow-2xl ">
            <div className="flex gap-4 ">
                {selectedStamp && (
                    <>
                        <div className="w-1/3">
                            <div className="aspect-square overflow-hidden rounded-md border-2 border-orange-900/20">
                                <img
                                    className="w-full h-full object-cover"
                                    src={selectedStamp.logo}
                                    alt={selectedStamp.name}
                                />
                            </div>
                        </div>
                        <div className="w-2/3 grid grid-cols-1 items-center">
                            <p className="text-cream-200 text-sm leading-relaxed">
                                {selectedStamp.description || "Un exquisito café de especialidad con notas distintivas y un perfil aromático único, cultivado en altitud y procesado con métodos tradicionales."}
                            </p>
                            <Badge

                                className={`${users?.stamps.find(s => s.id === selectedStamp.id) ? "bg-purple-500" : "bg-blue-500/60"} mx-auto`}>
                                <StarsIcon className="h-3 w-3 text-white" />
                                {users?.stamps.find(s => s.id === selectedStamp.id) ? "En tu colección" : "Por descubrir"}
                            </Badge>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between items-center">
                {selectedStamp && (
                    <>

                        <button className="px-6 py-2 bg-gradient-to-r mx-auto from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-md font-medium text-sm group" onClick={() => navigate("/coffeelover/map-coffelover")}>
                            <span className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 group-hover:animate-bounce" />
                                {/* {users?.stamps.find(s => s.id === selectedStamp.id) ? "Coleccionado" : "Visita la sucursal"} */}
                                Visita la sucursal
                            </span>
                        </button>
                    </>
                )}
            </div>
        </div>
    </DialogContent>
</Dialog>
)
}