import { useEffect, useState } from "react";
import { useMockStampsByPageQuery, useStampsByClientQuery, useStampsByPageQuery } from "@/api/queries/album/stamps.query";
import { getAuthStorage } from "@/common/utils/auth_storage.utils";
import { Stamps } from "@/api/types/album/stamps.types";
import { CardStamp } from "@/common/molecules/coffeelover/stamps/card_stamp.molecule";
import { CardEmpy } from "@/common/molecules/coffeelover/stamps/card_empy.molecule";
import { CardStampsError } from "@/common/molecules/coffeelover/stamps/card_error.molecule";
import { CardStampSkeleton } from "@/common/molecules/coffeelover/stamps/card_skeleton.molecule";
import { CardStampsDetails } from "@/common/molecules/coffeelover/stamps/dialog_details.molecule";
import { StampsByClientResponse } from "@/api/types/album/stamps.types";
import { Badge } from "@/common/ui/badge";
import { Card, CardContent } from "@/common/ui/card";
import { motion } from "framer-motion";
import { Calendar, Search } from "lucide-react";

interface PruebaProps {
    id_page: number;

}
export default function List_Stamps({ id_page }: PruebaProps) {

    const { user } = getAuthStorage();
    const { id } = user;
    const { data: users } = useStampsByClientQuery(id);
    const { data: stampData, error, isLoading } = useStampsByPageQuery(id_page);
    const [stamps, setStamps] = useState<Stamps[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [hoverStamp, setHoverStamp] = useState<number | null>(null);
    const [selectedStamp, setSelectedStamp] = useState<Stamps | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleFlip = (id: number) => {
        if (flippedCards.includes(id)) {
            setFlippedCards(flippedCards.filter(cardId => cardId !== id));
        } else {
            setFlippedCards([...flippedCards, id]);
        }

    }

    useEffect(() => {
        // Clear stamps and flipped cards when page changes
        setStamps([]);
        setFlippedCards([]);
        setHoverStamp(null);
        if (stampData?.stamps) {
            setStamps(stampData.stamps);
        }
        // console.log("stamps", stampData);
    }, [id, stampData]);


    const skeletonArray = Array(4).fill(0);


    // navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const latitude = position.coords.latitude;
    //       const longitude = position.coords.longitude;

    //       // Aquí haces la llamada al backend
    //     //   enviarUbicacionAlBackend(latitude, longitude);
    //     console.log("Latitud:", latitude);
    //     console.log("Longitud:", longitude);
    //     },
    //     (error) => {
    //       console.error("Error obteniendo la ubicación:", error);
    //     },
    //     {
    //       enableHighAccuracy: true,
    //       timeout: 5000,
    //       maximumAge: 0
    //     }
    //   );

    return (
        <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-2 w-full min-h-0 pb-20" onPointerDown={(e) => e.stopPropagation()}>
            <div className="w-full">
                {/* Loading State */}
                {isLoading && (
                    <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {skeletonArray.map((_, index) => (
                            <CardStampSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <CardStampsError />
                )}

                {/* No Stamps State */}
                {!isLoading && !error && stamps.length === 0 && (
                    <CardEmpy />
                )}

                {/* Stamps Display */}
                {!isLoading && !error && stamps.length > 0 && (
                    <div className="grid gap-3 grid-cols-2 sm:gap-4 md:gap-5 w-full sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 p-2 sm:p-3 md:p-4 lg:p-5">
                        {stamps.map((sello: Stamps) => {
                            const aplica = users?.stamps.find((selloCliente) => {
                                return selloCliente.id === sello.id;
                            });

                            const randomRotation = Math.random() * 3 - 1.5;

                            const isFlipped = flippedCards.includes(sello.id);
                            const isHovered = hoverStamp === sello.id;

                            return (
                                <div
                                    key={sello.id}
                                    className="h-40 sm:h-44 perspective"
                                    style={{ transform: `rotate(${randomRotation}deg)` }}
                                    onMouseEnter={() => setHoverStamp(sello.id)}
                                    onMouseLeave={() => setHoverStamp(null)}
                                >
                                    <motion.div
                                        className="relative w-full h-full preserve-3d cursor-pointer"
                                        animate={{
                                            rotateY: isFlipped ? 180 : 0,
                                            y: isHovered && !isFlipped ? -5 : 0,
                                            boxShadow: isHovered && !isFlipped ? "0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)" : "none"
                                        }}
                                        transition={{
                                            duration: isFlipped ? 0.6 : 0.3,
                                            ease: "easeInOut"
                                        }}

                                    >
                                        {/* Front of card - Stamp design */}
                                        <div className="absolute w-full h-full backface-hidden">
                                            <Card className={`bg-[#F5E4D2] h-full border-none ${aplica ? 'shadow-lg' : 'shadow-md opacity-90'} relative overflow-hidden`}>
                                                {/* Postage stamp serrated edges */}
                                                <div className="absolute top-0 right-0 bottom-0 left-0 border-[8px] border-[#F5E4D2] z-10 
                                                [mask-image:repeating-linear-gradient(0deg,transparent,transparent_6px,black_6px,black_12px),
                                                repeating-linear-gradient(90deg,transparent,transparent_6px,black_6px,black_12px),
                                                repeating-linear-gradient(180deg,transparent,transparent_6px,black_6px,black_12px),
                                                repeating-linear-gradient(270deg,transparent,transparent_6px,black_6px,black_12px)]"></div>

                                                {/* Stamp content with colorful geometric design */}
                                                <CardContent className="p-0 h-full flex flex-col relative">
                                                    {/* Colorful background frame similar to the image */}
                                                    <div className="absolute inset-2 bg-gray-100 border-2 border-[#F5E4D2] z-0"></div>

                                                    <div className="flex-1 overflow-hidden relative z-10 m-3 bg-white">
                                                        {/* Overlay for unavailable stamps */}
                                                        {!aplica && (
                                                            <div className="absolute inset-0 bg-gray-900/40 z-20 backdrop-blur-[1px]">
                                                                {/* Empty overlay */}
                                                            </div>
                                                        )}

                                                        {/* "Por descubrir" badge - moved outside the overlay */}
                                                        {!aplica && (
                                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                                                                <Badge className="bg-orange-500/90 px-2 py-0.5 text-xs font-medium shadow-lg rounded-full"
                                                                    onClick={(e) => {
                                                                        // e.preventDefault();
                                                                        // e.stopPropagation();
                                                                        console.log("Click en el sello");

                                                                        handleFlip(sello.id);
                                                                        setSelectedStamp(sello);
                                                                        setModalOpen(true);
                                                                    }}

                                                                >
                                                                    <Search className="h-3 w-3 mr-1" />
                                                                    Por descubrir
                                                                </Badge>
                                                            </div>
                                                        )}

                                                        {/* Quantity badge */}
                                                        <div className="absolute top-1 right-1 z-20">
                                                            <Badge className="bg-blue-500 px-1.5 py-0.5 text-[10px] font-medium shadow-sm rounded-full text-white">
                                                                {users?.stamps.find((selloCliente) => selloCliente.id === sello.id)?.quantity || 0}
                                                            </Badge>
                                                        </div>

                                                        {/* Stamp imagery with geometric art style */}
                                                        <div className="absolute inset-0 flex items-center justify-center p-2">
                                                            <div className="relative w-full h-full">
                                                                <img
                                                                    className="w-full h-full object-contain"
                                                                    src={sello.logo}
                                                                    alt={sello.name}
                                                                    style={{
                                                                        filter: !aplica ? 'grayscale(80%) contrast(0.9)' : 'saturate(1.2) contrast(1.1)',
                                                                        mixBlendMode: 'multiply'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div onClick={() => handleFlip(sello.id)} className="p-2 bg-white relative z-10 border-t border-t-gray-300">
                                                        <h3 className="text-xs font-bold text-gray-900 truncate">{sello.name}</h3>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <p className="text-[10px] text-gray-600 opacity-80">
                                                                Café de especialidad
                                                            </p>
                                                            <Badge className={`${aplica ? "bg-blue-400 text-white" : "bg-green-500 text-white"} text-[10px] px-1.5 py-0.5`}

                                                            >
                                                                {aplica ? "✓" : "Nuevo"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Back of card - Details */}
                                        <div className="absolute w-full h-full backface-hidden rotate-y-180">
                                            <Card className={`bg-[#F5E4D2] h-full border-none ${aplica ? 'shadow-lg' : 'shadow-md opacity-90'} relative overflow-hidden`}>
                                                {/* Postage stamp serrated edges */}
                                                <div className="absolute top-0 right-0 bottom-0 left-0 border-[8px] border-[#F5E4D2] z-10 
                                                [mask-image:repeating-linear-gradient(0deg,transparent,transparent_6px,black_6px,black_12px),
                                                repeating-linear-gradient(90deg,transparent,transparent_6px,black_6px,black_12px),
                                                repeating-linear-gradient(180deg,transparent,transparent_6px,black_6px,black_12px),
                                                repeating-linear-gradient(270deg,transparent,transparent_6px,black_6px,black_12px)]"></div>

                                                {/* Stamp content with colorful geometric design */}
                                                <CardContent className="p-0 h-full flex flex-col relative">
                                                    <div className="absolute inset-2 bg-gray-200 border-2 border-[#F5E4D2] z-0"></div>

                                                    <div className="flex-1 overflow-hidden relative z-10 m-3 bg-white p-3 flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-bold text-gray-900 mb-1">{sello.name}</h3>
                                                            <p className="text-xs text-gray-600 line-clamp-3">{sello.description || "Información no disponible"}</p>
                                                        </div>

                                                        <div className="mt-2">

                                                            <div className="flex justify-between items-center">

                                                                {aplica && (
                                                                    <Badge className="bg-green-500 text-white text-[10px] px-2 py-0.5">
                                                                        {aplica.quantity || 0 > 1 ? `${aplica.quantity} unidades` : "1 unidad"}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-2 bg-[#F5E4D2] relative z-10 border-t border-blue-200 flex justify-between items-center">
                                                        <p className="text-[10px] text-gray-600">
                                                            ID: {sello.id}
                                                        </p>
                                                        <Badge className="bg-[#DB8935] absolute text-white text-[10px] px-1.5 py-0.5"
                                                            onClick={(e) => {
                                                                handleFlip(sello.id);
                                                            }}
                                                        >
                                                            {aplica ? "Coleccionado" : "Por descubrir"}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </motion.div>

                                </div>
                            );
                        })}

                        <CardStampsDetails
                            users={users || null}
                            modalOpen={modalOpen}
                            setModalOpen={setModalOpen}
                            selectedStamp={selectedStamp}
                        />
                    </div>

                )}
            </div>

        </div>





    )
}