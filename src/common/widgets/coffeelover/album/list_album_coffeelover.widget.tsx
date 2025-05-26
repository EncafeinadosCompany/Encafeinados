import {  useAlbumsClientQuery} from "@/api/queries/album/album.query";
import { useEffect, useState } from "react";
import { Stamp} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CardError } from "@/common/molecules/coffeelover/album/card_error.molecule";
import { FilterAlbums } from "@/common/molecules/coffeelover/album/filtered_albums.molecule";
import { FilterButtons } from "@/common/molecules/coffeelover/album/filter_buttons.molecule";
import { CardAlbum } from "@/common/molecules/coffeelover/album/card_album.molecule";
import { InputSearch } from "@/common/molecules/coffeelover/album/input_search.molecule";
import { useNavigate } from "react-router-dom";
import { AlbumResponse} from "@/api/types/album/album.types";

const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-72 group">
        <div className="h-40 bg-gradient-to-r from-slate-200 to-slate-100 animate-pulse relative">
            <div className="absolute inset-0 bg-[radial-gradient(#f8f8f8_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        </div>
        <div className="p-4">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse mb-3 w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse w-1/2 mb-2"></div>
            <div className="flex mt-4 space-x-2">
                <div className="h-5 w-16 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full animate-pulse"></div>
                <div className="h-5 w-14 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

export default function ListAlbum() {
    const { data, error, isLoading } = useAlbumsClientQuery();
    const [albums, setAlbums] = useState<AlbumResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAlbums, setFilteredAlbums] = useState<AlbumResponse[]>([]);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (data) {
            setAlbums(data);
            setFilteredAlbums(data);
        }
    }, [data]);

    useEffect(() => {
        if (albums.length) {
            let filtered = albums;

            // Apply type filter if active
            if (activeFilter) {
                filtered = filtered.filter(album =>
                    album.type?.toLowerCase().includes(activeFilter.toLowerCase())
                );
            }

            // Apply search term
            filtered = filtered.filter(album =>
                album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.introduction?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setFilteredAlbums(filtered);
        }
    }, [searchTerm, activeFilter, albums]);

    const skeletonArray = Array(4).fill(0);

    // Format dates with fallback
    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return "N/A";
            return format(new Date(dateString), "d MMM yyyy", { locale: es });
        } catch (e) {
            return "Fecha inválida";
        }
    };

    const uniqueTypes = [...new Set(albums.map(album => album.type))].filter(Boolean);

    const handleFilterClick = (type: string) => {
        setActiveFilter(activeFilter === type ? null : type);
    };

    return (
        <div className="bg-gray-100 to-amber-50 h-full  p-4 sm:p-6 md:p-5 ">
            <div className="max-w-7xl mx-auto shadow-2xl rounded-md bg-white p-4 xl:p-6 h-full ">
            <div className="flex flex-col items-center justify-center pt-4">
                    {/* Title with coffee bean pattern backdrop */}
                    <div className="mb-4 text-center relative">
                        {/* Coffee bean background pattern */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0icmdiYSgxNDYsIDY0LCAzMiwgMC4xKSIvPjwvc3ZnPg==')] opacity-20 -z-10"></div>
                        
                        {/* Logo with coffee-themed styling */}
                        <div className="relative inline-block">
                            {/* Subtle coffee stain effect */}
                            <div className="absolute -inset-4 bg-amber-50 rounded-full opacity-30 blur-xl"></div>
                            
                            <h1 className="text-4xl font-serif font-bold bg-gradient-to-br from-amber-900 via-amber-700 to-amber-800 bg-clip-text text-transparent drop-shadow-sm">
                                Encafeinados
                            </h1>
                            
                            {/* Coffee bean divider */}
                            <div className="flex items-center justify-center mt-3 mb-2">
                                <div className="h-px w-12 bg-amber-800/30"></div>
                                <div className="mx-2 w-4 h-6 bg-amber-800 rounded-full transform rotate-45 relative">
                                    <div className="absolute inset-0 border-2 border-amber-700 rounded-full transform scale-90"></div>
                                </div>
                                <div className="h-px w-12 bg-amber-800/30"></div>
                            </div>
                         
                            {/* Quality indicator */}
                            <div className="mt-2 flex items-center justify-center">
                                <div className="px-3 py-1 bg-amber-100 rounded-full text-xs font-medium text-amber-800 flex items-center">
                                    <span className="mr-1 inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                                    Álbumes de Especialidad
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Search Bar with Google-like styling */}
                    <div className="w-full max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-white rounded-full shadow-md transition-all duration-300 group-hover:shadow-lg"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-full opacity-50"></div>
                        <InputSearch
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-0.5 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 rounded-full"></div>
                    </div>
                </div>

                {/* Type filter buttons */}
                {uniqueTypes.length > 0 && (
                    <FilterButtons
                        uniqueTypes={uniqueTypes}
                        setActiveFilter={setActiveFilter}
                        activeFilter={activeFilter}
                        handleFilterClick={handleFilterClick}

                    ></FilterButtons>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {skeletonArray.map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                )}

                {/* Error State - Enhanced with better illustration */}
                {error && (
                    <CardError />
                )}

                {/* No Albums State - Enhanced with coffee illustration */}
                {!isLoading && !error && filteredAlbums.length === 0 && (
                    <FilterAlbums
                        searchTerm={searchTerm}
                        setActiveFilter={setActiveFilter}
                        activeFilter={activeFilter}
                        setSearchTerm={setSearchTerm} />
                )}

                {/* Albums Display - Enhanced with better card design */}
                {!isLoading && !error && filteredAlbums.length > 0 && (
                    <div className="h-full max-h-[55vh]  xl:h-[56vh]  xl:max-h-[50vh] overflow-x-hidden overflow-y-auto  xl:flex xl:flex-col  xl:justify-center px-2">


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                        {filteredAlbums.map((album) => {
                            const randomRotation = Math.random() * 4 - 2

                            return (
                                <div
                                    key={album.id}
                                    onMouseEnter={() => setHoveredAlbum(album.id)}
                                    onMouseLeave={() => setHoveredAlbum(null)}
                                    className={`relative ${!album.status ? "opacity-80" : ""}`}
                                    style={{
                                        transform: `rotate(${randomRotation}deg)`,
                                    }}
                                >
                                    {/* Cinta adhesiva */}
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-amber-100/80 rounded-sm z-20 border border-amber-200/50"></div>

                                    {/* Sombra de la estampa */}
                                    <div className="absolute inset-0 bg-black/10 rounded-lg transform translate-x-1 translate-y-1 -z-10"></div>

                                    {/* Estampa de cafetería */}
                                   <div onClick={() => navigate(`/open-album?id=${album.id}`)} className="cursor-pointer">
                                   <CardAlbum
                                        hoveredAlbum={hoveredAlbum}
                                        album={album}
                                        formatDate={formatDate}
                                        setHoveredAlbum={setHoveredAlbum} />
                                   </div>
                                </div>
                            )
                        }
                        )}
                    </div>
                    </div>
                )}
            </div>

        </div>

    );
}