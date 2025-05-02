import { Albums, useAlbumsAllQuery } from "@/api/queries/album/albumQueries";
import { useEffect, useState } from "react";
import { Stamp} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CardError } from "@/common/molecules/coffeelover/ListAlbum/cardError";
import { FilterAlbums } from "@/common/molecules/coffeelover/ListAlbum/filteredAlbums";
import { FilterButtons } from "@/common/molecules/coffeelover/ListAlbum/filterButtons";
import { CardAlbum } from "@/common/molecules/coffeelover/ListAlbum/cardAlbum";
import { InputSearch } from "@/common/molecules/coffeelover/ListAlbum/inputsearch";
import { useNavigate } from "react-router-dom";

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
    const { data, error, isLoading } = useAlbumsAllQuery();
    const [albums, setAlbums] = useState<Albums[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAlbums, setFilteredAlbums] = useState<Albums[]>([]);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (data?.albums) {
            setAlbums(data.albums);
            setFilteredAlbums(data.albums);
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
                album.introduccion?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="bg-white to-amber-50 min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with enhanced styling */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    {/* Title with coffee bean pattern backdrop */}
                    <div className="flex items-center justify-center mb-8 md:mb-12">
                    <div className="relative inline-flex items-center px-6 py-3">
                        <div className="absolute inset-0 bg-orange-100 rounded-full opacity-20"></div>
                        <Stamp className="h-7 w-7 text-orange-800 mr-3" />
                        <h2 className="text-2xl md:text-3xl font-serif text-orange-900 tracking-tight">Álbumes</h2>
                    </div>
                </div>

                    {/* Enhanced Search Bar */}
                   <InputSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}/>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                )}
            </div>
        </div>

    );
}