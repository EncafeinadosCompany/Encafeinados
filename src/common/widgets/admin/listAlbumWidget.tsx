import { useAlbumsQuery } from "@/api/queries/admin/albumQueries"
import { AlbumResponse } from "@/api/types/albumTypes";
import { Skeleton } from "@/common/ui/skeleton";
import { Card, CardFooter, CardHeader } from "@/common/ui/card";
import { BookOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/common/ui/input";
import { Button } from "@/common/ui/button";
import { AlbumDetailDialog } from "@/common/molecules/admin/AlbumDetailDialog";
import { AlbumPagination } from "@/common/molecules/admin/AlbumPagination";
import { AlbumCard } from "@/common/molecules/admin/AlbumCard";

export const ListAlbumWidget = () => {
    const { data: listAlbum, isLoading, error } = useAlbumsQuery();

    const [selectedAlbum, setSelectedAlbum] = useState<AlbumResponse | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAlbums, setFilteredAlbums] = useState<AlbumResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const albumsPerPage = 4;

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

    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = filteredAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);
    const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);

    const handleViewDetail = (album: AlbumResponse) => {
        setSelectedAlbum(album);
        setIsDetailOpen(true);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3">
                {[1, 2, 3, 4].map((item) => (
                    <Card key={item} className="overflow-hidden border-2 border-amber-100 shadow-sm rounded-xl bg-white">
                        <Skeleton className="h-32 w-full" />
                        <CardHeader className="p-2.5">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full mt-2" />
                        </CardHeader>
                        <CardFooter className="bg-[#FAF3E0]/30 p-2.5">
                            <Skeleton className="h-6 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-b from-[#FAF3E0]/30 to-white p-3 md:p-4 rounded-xl overflow-auto h-full">
            <div className="flex items-center mb-4">
                <div className="flex-grow max-w-md relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-3.5 w-3.5 text-[#6F4E37]" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Buscar álbumes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 py-1 h-9 w-full rounded-full bg-white border-amber-200 focus-visible:ring-[#D4A76A]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            aria-label="Borrar búsqueda"
                        >
                            <span className="text-[#6F4E37] hover:text-[#2C1810]">×</span>
                        </button>
                    )}
                </div>
                
                {searchQuery && (
                    <div className="ml-3 px-3 py-1 bg-[#FAF3E0] rounded-full text-xs text-[#6F4E37] whitespace-nowrap">
                        {filteredAlbums.length} resultado{filteredAlbums.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentAlbums.map((album: AlbumResponse, index) => (
                    <AlbumCard
                        key={album.id}
                        album={album}
                        index={index}
                        onViewDetail={handleViewDetail}
                    />
                ))}
            </div>

            {filteredAlbums.length === 0 && (
                <div className="flex flex-col items-center justify-center p-6 text-center bg-[#FAF3E0]/30 rounded-xl border border-amber-100 my-4">
                    <BookOpen className="h-8 w-8 text-[#6F4E37] mb-2" />
                    <h3 className="font-medium text-[#2C1810]">
                        {searchQuery ? "No se encontraron álbumes" : "Crea tu primer álbum"}
                    </h3>
                    <p className="text-[#6F4E37] text-sm mt-1 max-w-md">
                        {searchQuery 
                            ? `No hay resultados para "${searchQuery}"`
                            : "Comienza a recopilar tus cafeterías favoritas"
                        }
                    </p>
                    {searchQuery && (
                        <Button 
                            onClick={() => setSearchQuery("")}
                            variant="outline"
                            className="mt-3 border-amber-200 text-[#6F4E37] hover:bg-[#FAF3E0] h-8 text-sm"
                        >
                            Limpiar búsqueda
                        </Button>
                    )}
                </div>
            )}

            <AlbumPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <AlbumDetailDialog 
                album={selectedAlbum}
                isOpen={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />
        </div>
    );
};