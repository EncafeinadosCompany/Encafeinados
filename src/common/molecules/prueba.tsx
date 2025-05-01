import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { stamps, stampsByClientResponse, stampsResponse, useStampsByClientQuery, useStampsByPageQuery } from "@/api/queries/album/stampsQueries";
import { Coffee, AlertCircle, Stamp, Bean, Gift, MapPin, Calendar, ArrowLeft, CircleCheck } from "lucide-react";

const sellosCliente = [
    { id:3 },
    { id:2 }
]

// Skeleton component for loading state
const SkeletonCard = () => (
    <div className="h-64 transform transition-all duration-300 hover:translate-y-[-4px]">
        <Card className="bg-white h-full border-none shadow-md relative overflow-hidden">
            {/* Postage stamp serrated edges effect */}
            <div className="absolute top-0 right-0 bottom-0 left-0 border-[10px] border-white z-10 
                [mask-image:repeating-linear-gradient(0deg,transparent,transparent_8px,black_8px,black_16px),
                repeating-linear-gradient(90deg,transparent,transparent_8px,black_8px,black_16px),
                repeating-linear-gradient(180deg,transparent,transparent_8px,black_8px,black_16px),
                repeating-linear-gradient(270deg,transparent,transparent_8px,black_8px,black_16px)]"></div>
            
            <div className="absolute inset-0 bg-[radial-gradient(#f3f3f3_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-300 to-amber-500"></div>
            
            <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 bg-cream-100 animate-pulse h-40 relative">
                    <div className="absolute inset-0 border-[8px] border-dashed border-orange-200/20"></div>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-100 animate-pulse">
                    <div className="h-6 bg-orange-200/60 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-orange-100/40 rounded-md w-1/2"></div>
                </div>
            </CardContent>
        </Card>
    </div>
);


interface PruebaProps {
id:number;

}

export default function Prueba ({id}: PruebaProps) {
    const {data: user, error: error_user} = useStampsByClientQuery(1);
    const {data: stampData, error, isLoading} = useStampsByPageQuery(id);
    const [stamps, setStamps] = useState<stamps[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [hoverStamp, setHoverStamp] = useState<number | null>(null);


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
        
        // Only set stamps if we have data for this specific page
        if (stampData?.stamps) {
            setStamps(stampData.stamps);
        }
        
        console.log(`Loading stamps for page ID: ${id}`);
    }, [id, stampData]);


    const skeletonArray = Array(4).fill(0);

    return (
        <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-2 w-full">
        <div className="w-full">
            <div className="w-full">
                
                
                {/* Loading State */}
                {isLoading && (
                    <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {skeletonArray.map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-md mx-auto">
                        <Card className="border-none shadow-xl overflow-hidden bg-white">
                            <div className="h-32 bg-orange-50 flex justify-center items-center border-b border-orange-100 relative">
                                <div className="absolute inset-0 opacity-10 bg-[url('/coffee-beans-pattern.png')] bg-repeat"></div>
                                <div className="rounded-full bg-orange-100 p-5">
                                    <AlertCircle className="h-8 w-8 text-orange-600" />
                                </div>
                            </div>
                            <CardContent className="p-8 flex flex-col items-center">
                                <h3 className="text-xl font-medium text-gray-900 mb-3 text-center">No pudimos servir tu colección</h3>
                                <p className="text-gray-600 text-center text-sm max-w-xs">
                                    Como cuando un barista no encuentra sus granos favoritos, estamos teniendo dificultades técnicas para servirte la experiencia completa.
                                </p>
                                <button 
                                    className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-sm font-medium text-sm flex items-center gap-2"
                                    onClick={() => window.location.reload()}
                                >
                                    <Coffee className="h-4 w-4" />
                                    <span>Reintentar</span>
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* No Stamps State */}
                {!isLoading && !error && stamps.length === 0 && (
                    <div className=" max-w-lg mx-auto">
                        <Card className="border-none shadow-xl overflow-hidden bg-white">
                            <div className="md:h-40 relative overflow-hidden bg-cream-50">
                                {/* Paper texture background */}
                                <div className="absolute inset-0 bg-[radial-gradient(#f8f8f8_2px,transparent_2px)] [background-size:20px_20px] opacity-70"></div>
                                
                                {/* Color gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-100/80 to-amber-100/80"></div>
                                
                                {/* Stamp collector's illustration */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4 transform">
                                        <div className="relative">
                                            <Stamp className="h-16 w-16 text-orange-300" />
                                            <motion.div 
                                                className="absolute inset-0" 
                                                animate={{ 
                                                    scale: [1, 1.1, 1],
                                                    opacity: [1, 0.8, 1]
                                                }}
                                                transition={{ 
                                                    repeat: Infinity, 
                                                    duration: 3,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <Stamp className="h-16 w-16 text-orange-200" />
                                            </motion.div>
                                        </div>
                                        <span className="text-orange-700 tracking-widest text-xs uppercase font-medium bg-cream-50 px-4 py-1 rounded-full shadow-sm">
                                            Colección nueva
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Decorative coffee bean patterns */}
                                <div className="absolute top-5 left-5 opacity-20 rotate-[-15deg]">
                                    <Bean className="h-8 w-8 text-orange-800" />
                                </div>
                                <div className="absolute bottom-5 right-5 opacity-20 rotate-[15deg]">
                                    <Bean className="h-8 w-8 text-orange-800" />
                                </div>
                            </div>
                            
                            <CardContent className="p-7 md:p-8">
                                <h3 className="text-xl font-medium text-gray-900 mb-3 text-center">
                                    Comienza tu viaje de café
                                </h3>
                                <p className="text-gray-600 text-center text-sm">
                                    Visita nuestras cafeterías de especialidad y comienza a coleccionar sellos únicos que reflejan el arte del café artesanal.
                                </p>
                                
                                <div className="mt-7 flex flex-col gap-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-cream-50 text-sm text-gray-700">
                                        <Bean className="h-5 w-5 text-orange-400 shrink-0" />
                                        <span>Descubre café de origen único y métodos de preparación artesanales</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-cream-50 text-sm text-gray-700">
                                        <Gift className="h-5 w-5 text-orange-400 shrink-0" />
                                        <span>Desbloquea experiencias exclusivas al completar tu colección</span>
                                    </div>
                                </div>
                                
                                <div className="mt-7 pt-5 border-t border-gray-100 flex justify-center">
                                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-md font-medium text-sm group">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 group-hover:animate-bounce" />
                                            Encuentra nuestras cafeterías
                                        </span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Stamps Display */}
                {!isLoading && !error && stamps.length > 0 && (
                    <div className="grid gap-2 grid-cols-2  sm:gap-3 md:gap-3 w-full w-max-sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5  overflow-auto max-h-[65vh]  p-2 sm:p-3 md:p-4 lg:p-5 xl:p-4 2xl:p-7">
                        {stamps.map((sello: stamps) => {
                            const aplica = user?.stamps.find((selloCliente) => {
                                return selloCliente.id === sello.id;
                            });
                            
                            const isFlipped = flippedCards.includes(sello.id);
                            const isHovered = hoverStamp === sello.id;

                            return (
                                <div 
                                    key={sello.id} 
                                    className="h-48 sm:h-56 perspective"
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
                                        onClick={(e) => {
                                            // Stop event propagation to prevent page turning
                                            // e.stopPropagation();
                                            handleFlip(sello.id);
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
                                                    <div className="flex-1 overflow-hidden relative">
                                                        {/* Overlay for unavailable stamps */}
                                                        {!aplica && (
                                                            <div className="absolute inset-0 bg-gray-900/40 z-10 flex justify-center items-center backdrop-blur-[1px]">
                                                                <Badge className="bg-orange-500/90 px-3 py-1 text-xs font-medium shadow-lg">
                                                                    Por descubrir
                                                                </Badge>
                                                            </div>
                                                        )}
                                                        
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
                                                    
                                                    <div className="p-3 bg-gradient-to-r from-cream-50 to-orange-50 flex justify-between items-center relative z-20">
                                                        <div>
                                                            <h3 className="text-sm font-bold text-gray-900">{sello.name}</h3>
                                                            <p className="text-xs text-gray-600 mt-0.5 opacity-80">
                                                                {isHovered ? 'Toca para voltear' : 'Café de especialidad'}
                                                            </p>
                                                        </div>
                                                        <Badge className={`${aplica ? "bg-emerald-500" : "bg-orange-400"} ml-2 shrink-0`}>
                                                            {aplica ? "Coleccionado" : "Nuevo"}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Back of card - Details */}
                                        <div className="absolute w-full h-full backface-hidden rotateY-180">
                                            <Card className="bg-[#292524]/50 h-full border-none shadow-xl text-cream-50">
                                                <CardContent className="p-5 h-full flex flex-col justify-between  overflow-y-auto overflow-x-hidden">
                                                    <div className="mt-6">
                                                        <h3 className="text-sm font-medium text-orange-100 mb-2 flex items-center gap-2">
                                                            <Stamp className="h-4 w-4 text-orange-300" />
                                                            {sello.name}
                                                        </h3>
                                                        <p className="text-cream-200 text-sm leading-relaxed">
                                                            {sello.description || "Un exquisito café de especialidad con notas distintivas y un perfil aromático único, cultivado en altitud y procesado con métodos tradicionales."}
                                                        </p>
                                                        
                                                        {/* Origin highlights */}
                                                        <div className="mt-3 pt-3 border-t border-gray-800/50">
                                                            <div className="flex items-center gap-2 text-xs text-orange-200">
                                                                <CircleCheck className="h-3 w-3" />
                                                                <span>{sello.status || "Disponible"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-4 pt-4 border-t border-gray-800/80">
                                                        <div className="flex justify-between items-center">
                                                            <Badge className={`${aplica ? "bg-emerald-500/90" : "bg-orange-500/80"}`}>
                                                                {aplica ? "En tu colección" : "Por descubrir"}
                                                            </Badge>
                                                            <span className="text-xs text-cream-300">
                                                                {aplica ? "Coleccionado" : "Visita la cafetería"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </motion.div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
        </div>
    )
}