import { useAlbumsQuery } from "@/api/queries/admin/albumQueries"
import { AlbumResponse } from "@/api/types/albumTypes";
import { Badge } from "@/common/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/common/ui/card";
import { Skeleton } from "@/common/ui/skeleton";
import { format } from "date-fns";
import { CalendarIcon, BookOpen, Eye, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/common/ui/dialog";
import { Input } from "@/common/ui/input";

export const ListAlbumWidget = () => {
    const { data: listAlbum, isLoading, error } = useAlbumsQuery();

    const [selectedAlbum, setSelectedAlbum] = useState<AlbumResponse | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);


    // State for search and pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAlbums, setFilteredAlbums] = useState<AlbumResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const albumsPerPage = 3;

    useEffect(() => {
        if (listAlbum) {
            const filtered = listAlbum.filter(album =>
                album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                album.introduction.toLowerCase().includes(searchQuery.toLowerCase()) ||
                album.type.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAlbums(filtered);
            setCurrentPage(1); 
        }
    }, [searchQuery, listAlbum]);


    // Calculate pagination
    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = filteredAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);
    const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);


    const handleViewDetail = (album: AlbumResponse) => {
        setSelectedAlbum(album);
        setIsDetailOpen(true);
    };


    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="overflow-hidden border border-gray-200 shadow-sm">
                        <Skeleton className="h-40 w-full" />
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4 mt-2" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-8 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los álbumes</h3>
                <p className="text-sm text-gray-500 max-w-md">
                    No pudimos cargar tus álbumes. Por favor, intenta de nuevo más tarde.
                </p>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
        } catch (e) {
            return "Fecha no disponible";
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-end justify-center mt-10 space-x-2">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded-full ${currentPage === page
                                ? 'bg-amber-300 text-white border '
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        );
    };


    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-2xl ">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Buscar álbumes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-full rounded-full bg-white/80"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <span className="text-gray-400 hover:text-gray-600">×</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Search results info */}
            {searchQuery && (
                <div className="mb-4 text-sm text-gray-500">
                    {filteredAlbums.length === 0
                        ? `No se encontraron resultados para "${searchQuery}"`
                        : `Se encontraron ${filteredAlbums.length} resultado${filteredAlbums.length !== 1 ? 's' : ''} para "${searchQuery}"`
                    }
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAlbums.map((album: AlbumResponse) => (
                    <Card key={album.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        {/* Card content remains the same */}
                        <div className="relative h-48 w-full bg-gray-100">
                            {album.logo ? (
                                <img
                                    src={album.logo}
                                    onError={(e) => { e.currentTarget.src = "/coffee-206142_1280.jpg" }}
                                    alt={album.title}
                                    className="h-full w-full object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-amber-50">
                                    <BookOpen className="h-16 w-16 text-amber-300" />
                                </div>
                            )}
                            <Badge
                                className={`absolute top-2 right-2 ${album.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {album.status ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Badge
                                className="absolute top-2 left-2 bg-amber-100 text-amber-800"
                            >
                                {album.type}
                            </Badge>
                        </div>

                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">{album.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {album.introduction}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-500">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                <span>
                                    {formatDate(album.start_date)}
                                    {album.end_date && ` - ${formatDate(album.end_date)}`}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span>{album.pages?.length || 0} páginas</span>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between">
                            <span className="text-xs text-gray-500">
                                Creado: {formatDate(album.createdAt)}
                            </span>
                            <button
                                onClick={() => handleViewDetail(album)}
                                className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center mt-3"
                            >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver detalles
                            </button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredAlbums.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="bg-amber-50 p-4 rounded-full mb-4">
                        <BookOpen className="h-10 w-10 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery ? "No se encontraron resultados" : "No hay álbumes disponibles"}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md">
                        {searchQuery 
                            ? `No hay álbumes que coincidan con "${searchQuery}". Intenta con otra búsqueda.`
                            : "Aún no has creado ningún álbum. Comienza creando tu primer álbum."
                        }
                    </p>
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="mt-4 px-4 py-2 border border-amber-200 text-amber-700 rounded-md hover:bg-amber-50"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            )}

            {/* Pagination */}
            {renderPagination()}

            {/* Album Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-3xl bg-white border-none">
                    {selectedAlbum && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">{selectedAlbum.title}</DialogTitle>
                                <DialogDescription>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Badge
                                            className={`${selectedAlbum.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {selectedAlbum.status ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                        <Badge className="bg-amber-100 text-amber-800">
                                            {selectedAlbum.type}
                                        </Badge>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
                                        {selectedAlbum.logo ? (
                                            <img
                                                src={selectedAlbum.logo}
                                                onError={(e) => { e.currentTarget.src = "/coffee-206142_1280.jpg" }}
                                                alt={selectedAlbum.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-amber-50">
                                                <BookOpen className="h-24 w-24 text-amber-300" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Periodo</h3>
                                            <p className="text-gray-900">
                                                {formatDate(selectedAlbum.start_date)}
                                                {selectedAlbum.end_date && ` - ${formatDate(selectedAlbum.end_date)}`}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Creado</h3>
                                            <p className="text-gray-900">{formatDate(selectedAlbum.createdAt)}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Actualizado</h3>
                                            <p className="text-gray-900">{formatDate(selectedAlbum.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Introducción</h3>
                                        <p className="text-gray-900 mt-1">{selectedAlbum.introduction}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Páginas ({selectedAlbum.pages?.length || 0})</h3>
                                        {selectedAlbum.pages && selectedAlbum.pages.length > 0 ? (
                                            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-2">
                                                {selectedAlbum.pages.map((page, index) => (
                                                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                        <h4 className="font-medium">Página {index + 1}</h4>
                                                        {/* Add more page details as needed */}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 mt-1">No hay páginas en este álbum</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setIsDetailOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cerrar
                                </button>

                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}