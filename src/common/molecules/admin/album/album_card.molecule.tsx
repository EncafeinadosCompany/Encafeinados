import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription } from "@/common/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/common/ui/badge";
import { Button } from "@/common/ui/button";
import { Calendar, Eye, Clock, Album } from'@/common/ui/icons';
import { AlbumResponse } from "@/api/types/album/album.types";

interface AlbumCardProps {
    album: AlbumResponse;
    index: number;
    onViewDetail: (album: AlbumResponse) => void;
    compact?: boolean;
    className?: string;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ 
    album, 
    index, 
    onViewDetail, 
    compact = false,
    className
}) => {
    // Función segura para formatear fechas que maneja undefined
    const formatDate = (dateString?: string) => {
        if (!dateString) {
            // Si no hay fecha, usamos la fecha de inicio como fallback
            // o "N/D" si tampoco está disponible
            return album.start_date 
                ? format(new Date(album.start_date), compact ? "d MMM" : "d MMM yyyy", { locale: es })
                : "N/D";
        }
        
        try {
            return format(new Date(dateString), compact ? "d MMM" : "d MMM yyyy", { locale: es });
        } catch (e) {
            return "N/D";
        }
    };
    
    // Función segura para calcular días desde una fecha que maneja undefined
    const getDaysSince = (dateString?: string): number => {
        if (!dateString) {
            // Si no hay fecha de creación, podemos usar start_date o la fecha actual
            if (!album.start_date) return 0;
            dateString = album.start_date;
        }
        
        try {
            const date = new Date(dateString);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate.getTime() - date.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } catch (e) {
            return 0;
        }
    };
    
    // Usamos la función segura para calcular días
    const daysSinceCreation = getDaysSince(album.createdAt);
    // También podemos manejar la fecha de inicio del álbum como alternativa
    const daysSinceStart = getDaysSince(album.start_date);
    const isNew = daysSinceCreation <= 3 || daysSinceStart <= 3; 
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
            className="h-full"
        >
            <Card className={`overflow-hidden border border-amber-100 rounded-lg shadow-sm hover:shadow-md 
                transition-all duration-300 transform hover:-translate-y-0.5 bg-white relative group h-full flex flex-col ${className}`}>
                {isNew && (
                    <div className="absolute left-0 top-4 z-10">
                        <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-md shadow-sm flex items-center">
                            <span className="animate-pulse mr-1">●</span> NUEVO
                        </div>
                    </div>
                )}
                
                <div className="relative w-full aspect-[4/3] bg-[#FAF3E0] overflow-hidden">
                    {album.logo ? (
                        <img
                            src={album.logo}
                            onError={(e) => { e.currentTarget.src = "/coffee-206142_1280.jpg" }}
                            alt={album.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#FAF3E0] to-[#F5E6C8]">
                            <Album className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} text-[#D4A76A]`} />
                        </div>
                    )}
                    
                    <Badge
                        className={`absolute top-2 right-2 ${album.status ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                            } px-1.5 py-0.5 text-[10px] font-medium`}
                    >
                        {album.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                </div>

                <CardHeader className={compact ? "p-2 pb-1.5" : "p-3 pb-2"} style={{flexGrow: 1, minHeight: compact ? '4rem' : '5rem'}}>
                    <CardTitle className="text-base font-medium text-[#2C1810] leading-tight line-clamp-1">
                        {album.title}
                    </CardTitle>
                    <CardDescription className={`text-[#6F4E37]/80 text-xs mt-1 ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}>
                        {album.introduction}
                    </CardDescription>
                </CardHeader>

                <div className="bg-gradient-to-r from-[#FAF3E0]/50 to-[#F5E6C8]/50 border-t border-amber-100 p-2.5 flex items-center justify-between mt-auto">
                    <div className="flex flex-col text-xs">
                        <span className="text-[#6F4E37] flex items-center whitespace-nowrap">
                            <Calendar className="h-3 w-3 mr-1.5 text-[#D4A76A] flex-shrink-0" />
                            <span className="truncate max-w-[80px]">
                                {/* Usamos formatDate con la fecha de inicio que siempre está presente */}
                                {formatDate(album.start_date)}
                            </span>
                        </span>
                        
                        <span className="text-[10px] text-[#6F4E37]/70 flex items-center mt-0.5">
                            <Clock className="h-2.5 w-2.5 mr-1 text-[#D4A76A]/70" />
                            {/* Mostramos información sobre la fecha usando una lógica defensiva */}
                            {album.createdAt 
                                ? `Hace ${daysSinceCreation} días` 
                                : `Inicia en ${formatDate(album.start_date)}`
                            }
                        </span>
                    </div>
                    <Button
                        onClick={() => onViewDetail(album)}
                        variant="ghost"
                        className="text-[#6F4E37] hover:text-[#2C1810] hover:bg-amber-100 text-xs p-1.5 h-auto rounded-full"
                    >
                        <Eye className="h-3 w-3 mr-1" />Ver
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
};