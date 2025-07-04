import { Stamps, StampsByClientResponse } from "@/api/types/album/stamps.types";
import { Badge } from "@/common/ui/badge";
import { Card, CardContent } from "@/common/ui/card";
import {motion} from "framer-motion";
import { Calendar, Search } from'@/common/ui/icons'
interface CardStampProps {
  stamps: Stamps[];
  users:StampsByClientResponse | null;
  flippedCards: number[];
  hoverStamp: number | null;
  setSelectedStamp: React.Dispatch<React.SetStateAction<Stamps | null>>;
  handleFlip: (stampId: number) => void;
  setModalOpen: (open: boolean) => void;
}


export const CardStamp = ({stamps, users, flippedCards, hoverStamp, handleFlip, setSelectedStamp, setModalOpen  }:CardStampProps) => {
  return (
    <div className="grid gap-2 grid-cols-2  sm:gap-3 md:gap-3 w-full w-max-sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6  overflow-auto max-h-[48vh]  p-2 sm:p-3 md:p-4 lg:p-5 xl:p-4 2xl:p-7">
    {stamps.map((sello: Stamps) => {
        const aplica = users?.stamps.find((selloCliente) => {
            return selloCliente.id === sello.id;
        });

        const randomRotation = Math.random() * 4 - 2


        const isFlipped = flippedCards.includes(sello.id);
        const isHovered = hoverStamp === sello.id;

        return (
            <div
                key={sello.id}
                className="h-48 sm:h-48 perspective"
                style={{ transform: `rotate(${randomRotation}deg)` }}
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
                    onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    
                        handleFlip(sello.id);
                        setSelectedStamp(sello);
                        setModalOpen(true);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();                           
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                >
                    {/* Front of card - Stamp design */}
                    <div className="absolute w-full h-full backface-hidden">
                        <Card className={`bg-white h-full border-none ${aplica ? 'shadow-lg' : 'shadow-md opacity-80'} relative overflow-hidden`}>
                            {/* Postage stamp serrated edges */}
                            <div className="absolute top-0 right-0 bottom-0 left-0 border-[10px] border-white z-10 
                            [mask-image:repeating-linear-gradient(0deg,transparent,transparent_8px,black_8px,black_16px),
                            repeating-linear-gradient(90deg,transparent,transparent_8px,black_8px,black_16px),
                            repeating-linear-gradient(180deg,transparent,transparent_8px,black_8px,black_16px),
                            repeating-linear-gradient(270deg,transparent,transparent_8px,black_8px,black_16px)]"></div>

                            {/* Perforated edge effect */}
                            <div className="absolute inset-0 bg-[radial-gradient(#f3f3f3_1px,transparent_1px)] [background-size:12px_12px] opacity-30 pointer-events-none"></div>

                            {/* Vintage postal marks in corners */}
                            <div className="absolute top-4 right-4 w-12 h-12 opacity-20 rotate-12">
                                <div className="w-full h-full rounded-full border-2 border-orange-800 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-orange-800" />
                                </div>
                            </div>

                            {/* Stamp status indicator */}
                            <div className={`absolute top-0 right-0 left-0 h-1 ${aplica ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-gradient-to-r from-orange-300 to-amber-500'}`}></div>
                        
                            <CardContent className="p-0 h-full flex flex-col">
                            
                                <div className="flex-1 h-1/3 overflow-hidden relative">
                                    {/* Overlay for unavailable stamps */}
                                    {!aplica && (
                                        <div className="absolute inset-0 bg-gray-900/40 z-10 flex justify-center items-center backdrop-blur-[1px]">
                                            <Badge className="bg-orange-500/90 px-3 py-1 text-xs font-medium shadow-lg rounded-full">
                                                <Search className="h-4 w-4 mr-1" />
                                                Por descubrir
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="absolute top-0 right-0 z-10 flex justify-center items-center backdrop-blur-[1px]">
                                        <Badge className="bg-orange-300 px-3 py-1 text-xs font-medium shadow-lg rounded-full">
                                            {users?.stamps.find((selloCliente) => selloCliente.id === sello.id)?.quantity || 0}
                                        </Badge>
                                    </div>

                                    {/* Stamp imagery */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={sello.logo}
                                            alt={sello.name}
                                            style={{ filter: !aplica ? 'grayscale(80%) contrast(0.9)' : 'none' }}
                                        />
                                    </div>

                                    {/* Portrait frame effect */}
                                    <div className="absolute inset-4 border-[1px] border-orange-800/10 pointer-events-none rounded-sm"></div>
                                </div>

                                <div className="p-3 bg-gradient-to-r from-cream-50 to-orange-50 grid grid-cols-1 gap-2 relative z-20">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{sello.name}</h3>
                                        <p className="text-xs text-gray-600 mt-0.5 opacity-80">
                                            {isHovered ? 'Toca para voltear' : 'Café de especialidad'}
                                        </p>
                                    </div>
                                    <Badge className={`${aplica ? "bg-emerald-300" : "bg-orange-400"} ml-2 shrink-0 mx-auto`}>
                                        {aplica ? "Coleccionado" : "Nuevo"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Back of card - Details */}
                    <div className="absolute w-full h-full backface-hidden rotateY-180">
                        <Card className="bg-[#292524]/50 h-full border-none shadow-xl text-cream-50">
                            <CardContent className="p-5 h-full flex flex-col justify-center">
                                <div className="flex-col justify-between   items-center gap-2 flex">
                                    <img src="/cafeino.png" alt="" />
                                    <Badge className={"bg-gray-400 m-2"}>
                                        Más información
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        )
    })}
</div>
  )
}