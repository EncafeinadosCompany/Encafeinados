import React, { useState, useEffect } from "react";
import { Badge } from "@/common/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BookOpen, CalendarIcon, Coffee, Loader2, Stamp as StampIcon, PlusCircle, RefreshCw } from "lucide-react";
import { PageStampsDialog } from "./PageStampsDialog";
import { CreatePageDialog } from "./CreatePageDialog";
import { AddStampsDialog } from "./AddStampsDialog";
import { useAlbumDetailsQuery } from "@/api/queries/album/album.query";

interface AlbumDetailDialogProps {
    albumId: number | null; 
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AlbumDetailDialog: React.FC<AlbumDetailDialogProps> = ({ 
    albumId, 
    isOpen, 
    onOpenChange 
}) => {
    const { data: album, isLoading, error, refetch } = useAlbumDetailsQuery(albumId);
    const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
    const [selectedPageName, setSelectedPageName] = useState<string>("");
    const [isStampsDialogOpen, setIsStampsDialogOpen] = useState(false);
    const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = useState(false);
    const [isAddStampsDialogOpen, setIsAddStampsDialogOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && albumId) {
            refetch();
        }
    }, [isOpen, albumId, refetch]);

    const showRefreshMessage = (message: string) => {
        setRefreshMessage(message);
        setTimeout(() => {
            setRefreshMessage(null);
        }, 3000);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/D";
        try {
            return format(new Date(dateString), "d MMM yyyy", { locale: es });
        } catch (e) {
            return "N/D";
        }
    };

    const handleViewStamps = (pageId: number, pageTitle: string) => {
        setSelectedPageId(pageId);
        setSelectedPageName(pageTitle);
        setIsStampsDialogOpen(true);
    };

    const handleAddStamps = (pageId: number, pageTitle: string) => {
        setSelectedPageId(pageId);
        setSelectedPageName(pageTitle);
        setIsAddStampsDialogOpen(true);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
        showRefreshMessage("Álbum actualizado");
    };

    if (!albumId) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl bg-[#FFFBF6] border-amber-100 rounded-xl p-0 flex flex-col max-h-[95vh] overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-10 w-10 animate-spin text-[#D4A76A]" />
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500">
                        <p>Error al cargar los detalles del álbum</p>
                        <Button 
                            variant="outline"
                            className="mt-4 border-red-200 text-red-600"
                            onClick={() => onOpenChange(false)}
                        >
                            Cerrar
                        </Button>
                    </div>
                ) : album ? (
                    <>
                        <DialogHeader className="border-b border-amber-100 bg-gradient-to-r from-[#FAF3E0] to-[#FAF3E0]/30 px-4 py-3 flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <DialogTitle className="text-xl font-medium text-[#2C1810] flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-[#6F4E37]" />
                                    {album.title}
                                </DialogTitle>
                                {/* <Button 
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-[#6F4E37] hover:text-[#D4A76A] hover:bg-[#FAF3E0]/50"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    title="Actualizar datos"
                                >
                                    {isRefreshing ? 
                                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                                        <RefreshCw className="h-4 w-4" />}
                                </Button> */}
                            </div>
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
                                    {refreshMessage && (
                                        <span className="text-xs text-green-600 ml-1 animate-pulse">
                                            {refreshMessage} ✓
                                        </span>
                                    )}
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
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-[#6F4E37]/10 text-[#6F4E37] text-xs">
                                                    {album.pages?.length || 0} páginas
                                                </Badge>
                                                
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="h-6 px-2 text-xs border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-1"
                                                    onClick={() => setIsCreatePageDialogOpen(true)}
                                                >
                                                    <PlusCircle className="h-3 w-3" />
                                                    Nueva
                                                </Button>
                                                
                                            </div>
                                        </div>
                                        
                                        {album.pages && album.pages.length > 0 ? (
                                            <div className="mt-2 flex flex-col gap-2">
                                                {album.pages.length > 3 && (
                                                    <div className="flex justify-between items-center px-2 py-1 bg-[#FAF3E0]/30 rounded text-xs text-[#6F4E37]">
                                                        <span>Mostrando {Math.min(album.pages.length, 10)} de {album.pages.length} páginas</span>
                                                        <span className="text-[#D4A76A]">Desplaza para ver más ↓</span>
                                                    </div>
                                                )}
                                                
                                                <div 
                                                    className="max-h-[240px] overflow-y-auto pr-2 space-y-2 rounded-sm"
                                                    style={{
                                                        scrollbarWidth: 'thin',
                                                        scrollbarColor: '#D4A76A #FAF3E0'
                                                    }}
                                                >
                                                    {album.pages.map((page, index) => (
                                                        <div 
                                                            key={index} 
                                                            className="p-2 bg-gradient-to-r from-[#FAF3E0]/50 to-white rounded border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="flex justify-between items-center mb-1.5">
                                                                <h4 className="font-medium text-[#2C1810] text-xs flex items-center gap-1">
                                                                    <span className="bg-[#6F4E37]/10 text-[#6F4E37] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold">
                                                                        {index + 1}
                                                                    </span>
                                                                    {page.title}
                                                                </h4>
                                                                <Badge className="bg-[#D4A76A]/10 text-[#6F4E37] text-[10px]">
                                                                    Cafetería
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-[#6F4E37] line-clamp-2 hover:line-clamp-none transition-all duration-300 mb-2">
                                                                {page.description}
                                                            </p>
                                                            
                                                            <div className="flex justify-end mt-1 space-x-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 text-xs border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-1.5"
                                                                    onClick={() => handleAddStamps(page.id, page.title)}
                                                                >
                                                                    <PlusCircle className="h-3 w-3 text-[#D4A76A]" />
                                                                    Añadir estampas
                                                                </Button>
                                                                
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 text-xs border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-1.5"
                                                                    onClick={() => handleViewStamps(page.id, page.title)}
                                                                >
                                                                    <StampIcon className="h-3 w-3 text-[#D4A76A]" />
                                                                    Ver estampas
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    {album.pages.length > 10 && (
                                                        <div className="text-center py-1 text-amber-500 text-xs italic">
                                                            Y {album.pages.length - 10} más...
                                                        </div>
                                                    )}
                                                </div>
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
                        <PageStampsDialog
                            pageId={selectedPageId}
                            pageName={selectedPageName}
                            isOpen={isStampsDialogOpen}
                            onOpenChange={setIsStampsDialogOpen}
                        />
                        <CreatePageDialog
                            albumId={album.id} 
                            albumTitle={album.title}
                            isOpen={isCreatePageDialogOpen}
                            onOpenChange={(open) => {
                                setIsCreatePageDialogOpen(open);
                                if (!open) {
                                    refetch().then(() => {
                                        showRefreshMessage("Página añadida");
                                    });
                                }
                            }}
                        />
                        <AddStampsDialog
                            pageId={selectedPageId}
                            pageName={selectedPageName}
                            isOpen={isAddStampsDialogOpen}
                            onOpenChange={(open) => {
                                setIsAddStampsDialogOpen(open);
                                if (!open) {
                                    refetch().then(() => {
                                        showRefreshMessage("Estampas actualizadas");
                                    });
                                }
                            }}
                            onSuccess={() => {
                                if (isStampsDialogOpen) {
                                    setIsStampsDialogOpen(false);
                                    setTimeout(() => {
                                        setIsStampsDialogOpen(true);
                                    }, 100);
                                }
                            }}
                        />
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};