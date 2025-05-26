import { usePageByAlbumQuery } from "@/api/queries/album/album.query";
import List_Stamps from "./coffeelover/album/list_stamps.widget";
import { useRef, useState } from "react";
import { Coffee, ChevronDown, StickyNote } from "lucide-react";
import { Button } from "@/common/ui/button";

export const Prueba_album = () => {
    const { data, isLoading, error } = usePageByAlbumQuery('1');
    const [activePageId, setActivePageId] = useState<number | null>(null);
    const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const scrollToPage = (pageId: number) => {
        if (pageRefs.current[pageId]) {
            pageRefs.current[pageId]?.scrollIntoView({ behavior: 'smooth' });
            setActivePageId(pageId);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center h-full p-6">
                <Coffee className="h-12 w-12 text-amber-600 animate-pulse mb-4" />
                <p className="text-amber-800 font-medium">Cargando páginas del álbum...</p>
            </div>
        );
    }

    if (error || !data?.pages || data.pages.length === 0) {
        return (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center h-full p-6">
                <Coffee className="h-12 w-12 text-amber-600 mb-4" />
                <h2 className="text-xl font-semibold text-amber-800 mb-2">No se encontraron páginas</h2>
                <p className="text-amber-700">No hay páginas disponibles en este álbum.</p>
            </div>
        );
    }

 
    return (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col h-full relative">
                    {/* Enhanced navigation bar with blurred background */}
                       <div className="sticky top-0 z-10 backdrop-blur-md bg-[#2A1A12]/95 border-b rounded-b-md border-[#3D2C22] shadow-sm px-4 py-3">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <Coffee className="h-5 w-5 text-[#D4B996] mr-2" />
                        <span className="text-[#E6CCAF] font-medium text-sm hidden sm:inline">Álbum del Café</span>
                    </div>
                    
                    <div className="flex-1 nav-scroll-container px-4">
                        <div className="flex gap-3 justify-center min-w-max mx-auto">
                            <Button
                                key="cover"
                                variant="ghost"
                                size="sm"
                                onClick={() => scrollToPage(0)}
                                className={`rounded-full px-4 transition-all duration-300 ${
                                    activePageId === 0 
                                        ? "bg-[#8C6D4F] text-[#F5E4D2] shadow-sm" 
                                        : "text-[#D4B996] hover:bg-[#3D2C22]"
                                }`}
                            >
                                Portada
                            </Button>
                            {data.pages.map((page) => (
                                <Button
                                    key={`nav-${page.id}`}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => scrollToPage(page.id)}
                                    className={`rounded-full px-4 transition-all duration-300 ${
                                        activePageId === page.id 
                                            ? "bg-[#5c402d] text-[#E6CCAF] shadow-sm" 
                                            : "text-[#D4B996] hover:bg-[#3D2C22]"
                                    }`}
                                >
                                    <StickyNote className="h-5 w-5 text-[#D4B996] mr-2" />
                                    {page.title}
                                </Button>
                            ))}
                            <Button
                                key="backcover"
                                variant="ghost"
                                size="sm"
                                onClick={() => scrollToPage(-1)}
                                className={`rounded-full px-4 transition-all duration-300 ${
                                    activePageId === -1 
                                        ? "bg-[#A67B5B] text-[#F5E4D2] shadow-sm" 
                                        : "text-[#D4B996] hover:bg-[#3D2C22]"
                                }`}
                            >
                                Contraportada
                            </Button>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block">
                        <span className="text-xs text-[#D4B996] italic">
                            {activePageId === 0 ? 'Portada' : 
                             activePageId === -1 ? 'Contraportada' : 
                             data.pages.find(p => p.id === activePageId)?.title || ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main content - vertical scrolling */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-16 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
                {/* Cover Page */}
                <div 
                    ref={(el: HTMLDivElement | null) => { pageRefs.current[0] = el }}
                    className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-b from-amber-100 to-amber-50"
                >
                    <div className="max-w-md mx-auto text-center">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-amber-600 rounded-full blur-2xl opacity-20"></div>
                            <Coffee className="h-24 w-24 text-amber-700 mx-auto relative z-10" />
                        </div>
                        <h1 className="text-4xl font-bold text-amber-800 mb-4">Álbum de Café</h1>
                        <p className="text-amber-700 text-lg mb-8">Colecciona estampas y descubre el maravilloso mundo del café</p>
                        <Button 
                            onClick={() => scrollToPage(data.pages[0]?.id || 0)}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Comenzar a explorar
                        </Button>
                    </div>
                    
                    <div className="flex flex-col items-center mt-12 text-amber-600">
                        <p className="text-sm mb-2">Desliza hacia abajo</p>
                        <ChevronDown className="h-6 w-6 animate-bounce" />
                    </div>
                </div>
                
                {/* Album Pages */}
                {data.pages.map((page, index) => (
                    <div 
                        key={page.id}
                        ref={(el: HTMLDivElement | null) => { pageRefs.current[page.id] = el }}
                        className={`w-full min-h-[calc(100vh-4rem)] py-8 px-4 ${
                            index % 2 === 0 ? 'bg-amber-50/70' : 'bg-white/70'
                        }`}
                    >
                        <div className="max-w-5xl mx-auto">
                            {/* Page header */}
                            <div className="mb-6 pb-4 border-b border-amber-200">
                                <h2 className="text-2xl font-bold text-amber-800">{page.title}</h2>
                                <p className="text-amber-700 mt-2">{page.description}</p>
                            </div>
                            
                            {/* Stamps content */}
                            <div className="w-full">
                                <List_Stamps id_page={page.id} />
                            </div>
                            
                            {/* Next page indicator (except for last page) */}
                            {index < data.pages.length - 1 && (
                                <div className="flex flex-col items-center mt-12 mb-4 text-amber-600">
                                    <p className="text-sm mb-2">Continúa hacia abajo</p>
                                    <ChevronDown className="h-6 w-6 animate-bounce" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {/* Back Cover */}
                <div 
                    ref={(el: HTMLDivElement | null) => { pageRefs.current[-1] = el }}
                    className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-b from-amber-50 to-amber-100"
                >
                    <div className="max-w-md mx-auto text-center">
                        <h2 className="text-3xl font-bold text-amber-800 mb-4">¡Gracias por explorar!</h2>
                        <p className="text-amber-700 mb-6">Continúa coleccionando estampas y descubriendo nuevas variedades de café.</p>
                        
                        <div className="p-6 bg-white/70 rounded-xl shadow-md border border-amber-200 mb-8">
                            <h3 className="text-xl font-semibold text-amber-700 mb-3">Tu progreso</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-amber-600">Páginas exploradas:</span>
                                <span className="font-medium text-amber-800">{data.pages.length }</span>
                            </div>
                            {/* <div className="flex justify-between items-center">
                                <span className="text-amber-600">Estampas disponibles:</span>
                                <span className="font-medium text-amber-800">{data.pages.reduce((total, page) => total + 1, 0) * 10}+</span>
                            </div> */}
                        </div>
                        
                        <Button 
                            onClick={() => scrollToPage(0)}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Volver al inicio
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

}