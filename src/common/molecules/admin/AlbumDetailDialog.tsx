import React from "react";
import { AlbumResponse } from "@/api/types/albumTypes";
import { Badge } from "@/common/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BookOpen, CalendarIcon, Coffee } from "lucide-react";

interface AlbumDetailDialogProps {
    album: AlbumResponse | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AlbumDetailDialog: React.FC<AlbumDetailDialogProps> = ({ 
    album, 
    isOpen, 
    onOpenChange 
}) => {
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d MMM yyyy", { locale: es });
        } catch (e) {
            return "N/D";
        }
    };

    if (!album) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl bg-[#FFFBF6] border-amber-100 rounded-xl p-0 flex flex-col max-h-[80vh] overflow-hidden">
                <DialogHeader className="border-b border-amber-100 bg-gradient-to-r from-[#FAF3E0] to-[#FAF3E0]/30 px-4 py-3 flex-shrink-0">
                    <DialogTitle className="text-xl font-medium text-[#2C1810] flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#6F4E37]" />
                        {album.title}
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex items-center space-x-2 mt-1">
                            <Badge
                                className={`${album.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                                {album.status ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Badge className="bg-[#6F4E37] text-white">
                                {album.type}
                            </Badge>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <div className="relative rounded-lg overflow-hidden shadow-md border border-amber-100 h-48 bg-white">
                                {album.logo ? (
                                    <img
                                        src={album.logo}
                                        onError={(e) => { e.currentTarget.src = "/coffee-206142_1280.jpg" }}
                                        alt={album.title}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#FAF3E0] to-white">
                                        <BookOpen className="h-20 w-20 text-[#D4A76A]" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 space-y-2 bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                                <h3 className="font-medium text-[#2C1810] flex items-center gap-1.5 text-sm">
                                    <CalendarIcon className="h-3.5 w-3.5 text-[#D4A76A]" />
                                    Detalles del Período
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <h4 className="text-xs font-medium text-[#6F4E37]">Inicio</h4>
                                        <p className="text-[#2C1810] text-xs bg-[#FAF3E0]/50 rounded px-2 py-1">
                                            {formatDate(album.start_date)}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-xs font-medium text-[#6F4E37]">Fin</h4>
                                        <p className="text-[#2C1810] text-xs bg-[#FAF3E0]/50 rounded px-2 py-1">
                                            {formatDate(album.end_date)}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-xs font-medium text-[#6F4E37]">Creado</h4>
                                        <p className="text-[#2C1810] text-xs bg-[#FAF3E0]/50 rounded px-2 py-1">
                                            {formatDate(album.createdAt)}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-xs font-medium text-[#6F4E37]">Actualizado</h4>
                                        <p className="text-[#2C1810] text-xs bg-[#FAF3E0]/50 rounded px-2 py-1">
                                            {formatDate(album.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                                <h3 className="font-medium text-[#2C1810] mb-2 flex items-center gap-1.5 text-sm">
                                    <Coffee className="h-3.5 w-3.5 text-[#D4A76A]" />
                                    Introducción
                                </h3>
                                <div className="bg-[#FAF3E0]/30 rounded p-3 text-[#6F4E37] text-sm border border-amber-100/50">
                                    {album.introduction}
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-[#2C1810] flex items-center gap-1.5 text-sm">
                                        <BookOpen className="h-3.5 w-3.5 text-[#D4A76A]" />
                                        Páginas
                                    </h3>
                                    <Badge className="bg-[#6F4E37]/10 text-[#6F4E37] text-xs">
                                        {album.pages?.length || 0} páginas
                                    </Badge>
                                </div>
                                
                                {album.pages && album.pages.length > 0 ? (
                                    <div className="mt-2 grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-2">
                                        {album.pages.map((page, index) => (
                                            <div 
                                                key={index} 
                                                className="p-2 bg-gradient-to-r from-[#FAF3E0]/50 to-white rounded border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-medium text-[#2C1810] text-xs">Página {index + 1}</h4>
                                                    <Badge className="bg-[#D4A76A]/10 text-[#6F4E37] text-[10px]">
                                                        Cafetería
                                                    </Badge>
                                                </div>
                                               
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-3 text-center bg-[#FAF3E0]/20 rounded border border-amber-100/50">
                                        <BookOpen className="h-6 w-6 text-[#D4A76A]/70 mb-1" />
                                        <p className="text-[#6F4E37] text-xs">Sin páginas en este álbum</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            
            </DialogContent>
        </Dialog>
    );
};