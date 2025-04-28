import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/common/ui/card";
import { Badge } from "@/common/ui/badge";
import { Button } from "@/common/ui/button";
import { AlbumResponse } from "@/api/types/albumTypes";
import { CalendarIcon, Eye, Album } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AlbumCardProps {
    album: AlbumResponse;
    index: number;
    onViewDetail: (album: AlbumResponse) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, index, onViewDetail }) => {
    // Formato de fecha simplificado
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d MMM yyyy", { locale: es });
        } catch (e) {
            return "N/D";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
            className="h-full"
        >
            <Card className="overflow-hidden border border-amber-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 bg-white relative group h-full flex flex-col">
                <div className="relative h-36 sm:h-40 md:h-44 lg:h-48 w-full bg-[#FAF3E0] overflow-hidden">
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
                            <Album className="h-12 w-12 text-[#D4A76A]" />
                        </div>
                    )}
                    
                    <Badge
                        className={`absolute top-2 right-2 ${album.status ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                            } px-1.5 py-0.5 text-[10px] font-medium`}
                    >
                        {album.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                    
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[#2C1810] h-6 w-6 rounded-full flex items-center justify-center shadow-sm text-[10px] font-medium">
                        {album.pages?.length || 0}
                    </div>
                </div>

                {/* Contenido con altura consistente */}
                <CardHeader className="p-3 pb-2 flex-grow flex flex-col justify-start">
                    <CardTitle className="text-base font-medium text-[#2C1810] leading-tight line-clamp-1">
                        {album.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-[#6F4E37]/80 text-xs mt-1 min-h-[2.5rem]">
                        {album.introduction}
                    </CardDescription>
                </CardHeader>

                {/* Footer con altura fija */}
                <CardFooter className="bg-gradient-to-r from-[#FAF3E0]/50 to-[#F5E6C8]/50 border-t border-amber-100 p-2.5 flex items-center justify-between mt-auto">
                    <span className="text-xs text-[#6F4E37] flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1.5 text-[#D4A76A]" />
                        {formatDate(album.start_date)}
                    </span>
                    <Button
                        onClick={() => onViewDetail(album)}
                        variant="ghost"
                        className="text-[#6F4E37] hover:text-[#2C1810] hover:bg-amber-100 text-xs p-1.5 h-auto rounded-full"
                    >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};