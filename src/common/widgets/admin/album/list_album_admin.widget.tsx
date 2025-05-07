import { Skeleton } from "@/common/ui/skeleton";
import { Card, CardFooter, CardHeader } from "@/common/ui/card";
import { BookOpen, Search, X, Coffee, Filter, SlidersHorizontal, Calendar, CheckCircle, XCircle, Sparkles, Layout, List, Eye} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/common/ui/input";
import { Button } from "@/common/ui/button";
import { AlbumDetailDialog } from "@/common/molecules/admin/album/album_detail_dialog.molecule";
import { AlbumPagination } from "@/common/molecules/admin/album/album_pagination.molecule";
import { AlbumCard } from "@/common/molecules/admin/album/album_card.molecule";
import { Badge } from "@/common/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/common/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { AlbumResponse } from "@/api/types/album/album.types";
import { useAlbumsQuery } from "@/api/queries/album/album.query";

export const ListAlbumWidget = () => {
    const { data: listAlbum, isLoading, error } = useAlbumsQuery();
    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null); // Cambiamos de objeto a ID
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAlbums, setFilteredAlbums] = useState<AlbumResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const albumsPerPage = 4;
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        if (listAlbum) {
            let filtered = listAlbum;
            
            if (searchQuery) {
                filtered = filtered.filter(album =>
                    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    album.introduction.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    album.type.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            
            if (activeFilter !== 'all') {
                filtered = filtered.filter(album => 
                    (activeFilter === 'active' ? album.status : !album.status)
                );
            }
            
            setFilteredAlbums(filtered);
            setCurrentPage(1);
        }
    }, [searchQuery, listAlbum, activeFilter]);

    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = filteredAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);
    const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);

    const handleViewDetail = (album: AlbumResponse) => {
        setSelectedAlbumId(album.id);
        setIsDetailOpen(true);
    };
    
    // Stats
    const totalAlbums = listAlbum?.length || 0;
    const activeAlbums = listAlbum?.filter(album => album.status).length || 0;

    // Función para renderizar el estado de carga con esqueletos
    const renderSkeletons = () => (
        <div className="bg-gradient-to-b from-[#FAF3E0]/30 to-white/80 p-3 md:p-4 rounded-xl h-full">
            <div className="flex items-center justify-between mb-5">
                <Skeleton className="h-9 w-48 rounded-lg" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {[1, 2, 3, 4].map((item) => (
                    <Card key={item} className="overflow-hidden border border-amber-100 shadow-sm rounded-xl bg-white h-full flex flex-col animate-pulse">
                        <div className="bg-amber-50 h-44 w-full relative">
                            <Skeleton className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-100/30 to-amber-50" />
                        </div>
                        <CardHeader className="p-3">
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-3.5 w-full mb-1" />
                            <Skeleton className="h-3.5 w-2/3" />
                        </CardHeader>
                        <CardFooter className="bg-[#FAF3E0]/30 p-3 mt-auto border-t border-amber-50">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-8 w-12 ml-auto rounded-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );

    if (isLoading) {
        return renderSkeletons();
    }

    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 h-full bg-gradient-to-br from-red-50/50 to-white rounded-lg border border-red-100"
            >
                <div className="bg-red-50 p-4 rounded-full mb-4 border border-red-100">
                    <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No se pudieron cargar los álbumes</h3>
                <p className="text-sm text-gray-500 text-center max-w-md mb-4">
                    Ha ocurrido un error al obtener los datos. Por favor, intenta nuevamente en unos momentos.
                </p>
                <Button 
                    variant="outline"
                    className="border-red-200 hover:bg-red-50 text-red-600"
                >
                    Reintentar
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <header className="p-3 md:p-4 bg-gradient-to-r from-[#FAF3E0] to-white border-b border-amber-100 sticky top-0 z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>                   
                        <div className="flex gap-3 mt-1.5 text-xs">
                            <Badge variant="outline" className="bg-white px-2 py-0.5 text-[#6F4E37] border-amber-200">
                                <Coffee className="h-3 w-3 mr-1 text-[#D4A76A]" />
                                {totalAlbums} total
                            </Badge>
                            <Badge variant="outline" className="bg-white/70 px-2 py-0.5 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                {activeAlbums} activos
                            </Badge>
                            <Badge variant="outline" className="bg-white/70 px-2 py-0.5 text-gray-600 border-gray-200">
                                <XCircle className="h-3 w-3 mr-1 text-gray-400" />
                                {totalAlbums - activeAlbums} inactivos
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-amber-200 hover:bg-[#FAF3E0] text-[#6F4E37] h-9"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                                    Filtrar
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-amber-100">
                                <DropdownMenuItem 
                                    className={`${activeFilter === 'all' ? 'bg-[#FAF3E0]/50 text-[#2C1810]' : ''}`}
                                    onClick={() => setActiveFilter('all')}
                                >
                                    <Sparkles className="h-3.5 w-3.5 mr-2 text-[#D4A76A]" /> 
                                    Todos
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className={`${activeFilter === 'active' ? 'bg-[#FAF3E0]/50 text-[#2C1810]' : ''}`}
                                    onClick={() => setActiveFilter('active')}
                                >
                                    <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-500" /> 
                                    Activos
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className={`${activeFilter === 'inactive' ? 'bg-[#FAF3E0]/50 text-[#2C1810]' : ''}`}
                                    onClick={() => setActiveFilter('inactive')}
                                >
                                    <XCircle className="h-3.5 w-3.5 mr-2 text-gray-400" /> 
                                    Inactivos
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button
                            variant="outline"
                            size="icon"
                            className={`border-amber-200 h-9 w-9 ${viewMode === 'grid' 
                                ? 'bg-[#FAF3E0]/70 text-[#2C1810]'
                                : 'bg-white/80 text-[#6F4E37] hover:bg-[#FAF3E0]/50'
                            }`}
                            onClick={() => setViewMode('grid')}
                            aria-label="Vista de cuadrícula"
                        >
                            <Layout className="h-3.5 w-3.5" />
                        </Button>
                        
                        <Button
                            variant="outline"
                            size="icon"
                            className={`border-amber-200 h-9 w-9 ${viewMode === 'list' 
                                ? 'bg-[#FAF3E0]/70 text-[#2C1810]'
                                : 'bg-white/80 text-[#6F4E37] hover:bg-[#FAF3E0]/50'
                            }`}
                            onClick={() => setViewMode('list')}
                            aria-label="Vista de lista"
                        >
                            <List className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
                
                <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className={`transition-colors duration-300 h-4 w-4 ${isSearchFocused ? 'text-[#D4A76A]' : 'text-[#6F4E37]/70'}`} />
                    </div>
                    <Input
                        type="text"
                        placeholder="Buscar por título, descripción o tipo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`pl-10 py-2 h-10 w-full rounded-lg bg-white ${
                            isSearchFocused 
                                ? 'border-amber-300 ring-1 ring-amber-200/50 shadow-sm' 
                                : 'border-amber-100'
                        } transition-all duration-200 focus-visible:ring-[#D4A76A]`}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-3 flex items-center"
                            aria-label="Borrar búsqueda"
                        >
                            <div className="bg-[#FAF3E0] text-[#6F4E37] hover:text-[#2C1810] p-1 rounded-full transition-colors">
                                <X className="h-3.5 w-3.5" />
                            </div>
                        </button>
                    )}
                    
                    {/* Badge de resultados de búsqueda */}
                    {searchQuery && (
                        <div className="absolute -bottom-6 left-3 flex items-center gap-1.5 text-xs bg-[#FAF3E0]/80 px-2 py-0.5 rounded-md text-[#6F4E37]">
                            <span className="font-medium">{filteredAlbums.length}</span> 
                            resultado{filteredAlbums.length !== 1 ? 's' : ''} para "{searchQuery}"
                        </div>
                    )}
                    
                    {/* Indicador de filtro activo */}
                    {activeFilter !== 'all' && !searchQuery && (
                        <div className="absolute -bottom-6 left-3 flex items-center gap-1.5 text-xs bg-blue-50 px-2 py-0.5 rounded-md text-blue-600">
                            Filtrado: <span className="font-medium">{activeFilter === 'active' ? 'Solo activos' : 'Solo inactivos'}</span>
                            <button 
                                onClick={() => setActiveFilter('all')} 
                                className="ml-1 bg-blue-100 rounded-full p-0.5 text-blue-600 hover:bg-blue-200"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-grow flex flex-col min-h-0 w-full overflow-hidden">
                {/* El truco del scroll: contenedor relativo con altura 0 + contenedor absoluto con scroll */}
                <div className="flex-grow relative h-0 min-h-0 w-full">
                    <div 
                        className="absolute inset-0 overflow-y-auto p-3 md:p-4 pt-5 bg-gradient-to-b from-[#FAF3E0]/10 to-white"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#F3D19E transparent'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {filteredAlbums.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col items-center justify-center p-6 md:p-8 text-center bg-[#FAF3E0]/30 rounded-xl border border-amber-100 my-4"
                                >
                                    <div className="bg-[#FAF3E0]/80 p-4 rounded-full mb-4 border border-amber-200">
                                        <BookOpen className="h-8 w-8 text-[#D4A76A]" />
                                    </div>
                                    <h3 className="font-medium text-lg text-[#2C1810]">
                                        {searchQuery || activeFilter !== 'all' 
                                            ? "No se encontraron álbumes" 
                                            : "Crea tu primer álbum"}
                                    </h3>
                                    <p className="text-[#6F4E37] text-sm mt-2 max-w-md">
                                        {searchQuery 
                                            ? `No hay resultados para "${searchQuery}"${activeFilter !== 'all' ? ` con el filtro "${activeFilter === 'active' ? 'activo' : 'inactivo'}"` : ''}`
                                            : activeFilter !== 'all'
                                                ? `No hay álbumes ${activeFilter === 'active' ? 'activos' : 'inactivos'}`
                                                : "Comienza a recopilar tus cafeterías favoritas en álbumes temáticos"
                                        }
                                    </p>
                                    <div className="flex gap-2 mt-4">
                                        {(searchQuery || activeFilter !== 'all') && (
                                            <Button 
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setActiveFilter('all');
                                                }}
                                                variant="outline"
                                                className="border-amber-200 text-[#6F4E37] hover:bg-[#FAF3E0]"
                                            >
                                                <Filter className="h-3.5 w-3.5 mr-1.5" />
                                                Limpiar filtros
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={`view-${viewMode}-${searchQuery}-${activeFilter}-${currentPage}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                            {currentAlbums.map((album: AlbumResponse, index) => (
                                                <motion.div 
                                                    key={album.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
                                                >
                                                    <AlbumCard
                                                        album={album}
                                                        index={index}
                                                        onViewDetail={handleViewDetail}
                                                    />
                                                </motion.div>
                                            ))}
                                            
                                            {currentAlbums.length > 0 && currentAlbums.length < 4 && 
                                                Array.from({ length: 4 - currentAlbums.length }).map((_, index) => (
                                                    <div key={`empty-${index}`} className="invisible"></div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {currentAlbums.map((album: AlbumResponse, index) => (
                                                <motion.div
                                                    key={album.id}
                                                    initial={{ opacity: 0, x: -5 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.15, delay: index * 0.03 }}
                                                >
                                                    <Card className="overflow-hidden border border-amber-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 bg-white">
                                                        <div className="flex items-center p-3">
                                                            <div className="h-14 w-14 rounded-md overflow-hidden mr-3 bg-[#FAF3E0] flex-shrink-0">
                                                                {album.logo ? (
                                                                    <img 
                                                                        src={album.logo} 
                                                                        alt={album.title}
                                                                        className="h-full w-full object-cover"
                                                                        loading="lazy"
                                                                        onError={(e) => { e.currentTarget.src = "/coffee-206142_1280.jpg" }}
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#FAF3E0] to-[#F5E6C8]">
                                                                        <BookOpen className="h-6 w-6 text-[#D4A76A]" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="flex-grow min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <h3 className="font-medium text-[#2C1810] truncate mr-2">{album.title}</h3>
                                                                    <Badge className={`${album.status ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'} flex-shrink-0`}>
                                                                        {album.status ? 'Activo' : 'Inactivo'}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-[#6F4E37]/80 line-clamp-1">{album.introduction}</p>
                                                                <div className="flex items-center justify-between mt-1">
                                                                    <div className="flex items-center text-xs text-[#6F4E37]">
                                                                        <Calendar className="h-3 w-3 mr-1 text-[#D4A76A]" />
                                                                        {album.createdAt 
                                                                            ? new Date(album.createdAt).toLocaleDateString()
                                                                            : new Date(album.start_date).toLocaleDateString() // Usamos start_date como fallback
                                                                        }
                                                                    </div>
                                                                    <Button
                                                                        onClick={() => handleViewDetail(album)}
                                                                        variant="ghost"
                                                                        className="text-[#6F4E37] hover:text-[#2C1810] hover:bg-amber-100 text-xs p-1.5 h-auto"
                                                                    >
                                                                        <Eye className="h-3.5 w-3.5 mr-1" />
                                                                        Ver detalles
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Mueve la paginación aquí dentro, como parte del contenido scrollable */}
                                    {totalPages > 1 && (
                                        <div className="mt-5 flex justify-center">
                                            <AlbumPagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={setCurrentPage}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <AlbumDetailDialog 
                albumId={selectedAlbumId}
                isOpen={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />
        </div>
    );
};