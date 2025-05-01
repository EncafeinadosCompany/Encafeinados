import { Page, usePageByAlbumQuery } from "@/api/queries/album/albumQueries";
import HTMLFlipBook from 'react-pageflip';
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Coffee, AlertCircle, Info, X, Stamp } from "lucide-react";
import Prueba from "../prueba";


export const PageAlbum = () => {
    const [searchParams] = useSearchParams();
    const id_album = searchParams.get("id");
    const bookRef = useRef<any>(null);
    const [bookDimensions, setBookDimensions] = useState({ width: 300, height: 400 });
    const [currentPage, setCurrentPage] = useState(0);
    const [stampsPerPage, setStampsPerPage] = useState(4);
    const [page, setPage] = useState<Page[]>([]);
    const { data, isLoading, error } = usePageByAlbumQuery(id_album);
    const [orientation, setOrientation] = useState('portrait');
    const [showTips, setShowTips] = useState(false);






    useEffect(() => {
        data && setPage(data.pages);
    }, [data]);

    // Enhanced resize handler for full-screen experience
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Detect orientation using local variable
            const currentOrientation = width > height ? 'landscape' : 'portrait';
            setOrientation(currentOrientation);

            // FULL SCREEN APPROACH:
            // Use almost the entire screen with minimal padding
            const minimalPadding = 10; // px

            const availableHeight = height - (minimalPadding * 2);
            const availableWidth = width - (minimalPadding * 2);

            // ADJUSTED ASPECT RATIO: Make album slightly taller
            // Reduced aspect ratio values = taller album relative to width
            let idealAspectRatio = currentOrientation === 'landscape' ? 0.9 : 0.65; // Was 1.5 and 0.7

            let newWidth, newHeight;

            // Always prioritize using maximum screen space
            if (width / height < idealAspectRatio) {
                // Width-constrained - use full width
                newWidth = availableWidth;
                newHeight = newWidth / idealAspectRatio;
            } else {
                // Height-constrained - use full height
                newHeight = availableHeight;
                newWidth = newHeight * idealAspectRatio;
            }

            // Ensure we never exceed available space
            newWidth = Math.min(newWidth, availableWidth);
            newHeight = Math.min(newHeight, availableHeight);

            // Apply a slight height boost (5% taller)
            newHeight = Math.min(newHeight * 1.05, availableHeight);

            // Set stamps per page based on available space
            let stamps = 4; // Default

            if (newWidth < 300) {
                stamps = 1;
            } else if (newWidth < 500) {
                stamps = 2;
            } else if (newWidth < 800) {
                stamps = 4;
            } else {
                stamps = 6;
            }

            setBookDimensions({
                width: Math.floor(newWidth),
                height: Math.floor(newHeight)
            });
            setStampsPerPage(stamps);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100);
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    const handlePageChange = (e: any) => {
        setCurrentPage(e.data);
    };

    const goNext = () => {
        if (bookRef.current?.pageFlip) {
            bookRef.current.pageFlip().flipNext();
        }
    };

    const goPrev = () => {
        if (bookRef.current?.pageFlip) {
            bookRef.current.pageFlip().flipPrev();
        }
    };



    useEffect(() => {
        // Styles for better mobile scrolling
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .touch-auto {
                touch-action: auto !important;
            }
            
            @media (max-width: 640px) {
                /* Mejoras para scroll en iOS */
                .overflow-y-auto {
                    -webkit-overflow-scrolling: touch !important;
                    overscroll-behavior-y: contain !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    touch-action: pan-y !important;
                    position: relative;
                }
                
                /* Asegura que el contenedor tiene suficiente altura para mostrar contenido */
                .overflow-y-auto > div {
                    min-height: 101%;
                }
            }
        `;
        document.head.appendChild(styleEl);
        
        return () => {
            document.head.removeChild(styleEl);
        };
    }, []);
    // Calculate total pages
    // const totalPages = page?.pages?.length ? page.pages.length + 1 : 1; // +1 for cover

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-amber-50/30 p-4">
                <Loader2 className="h-12 w-12 text-amber-700 animate-spin mb-4" />
                <p className="text-amber-900 font-medium text-lg">Cargando álbum...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-amber-50/30 p-6 max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No se pudo cargar el álbum</h3>
                <p className="text-gray-600 text-center mb-6">
                    Ha ocurrido un error al intentar cargar este álbum. Por favor, inténtelo de nuevo más tarde.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const TipsModal = () => (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${showTips ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 relative">
                {/* Botón de cierre en la esquina superior derecha */}
                <button 
                    onClick={() => setShowTips(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Cerrar consejos"
                >
                    <X className="h-5 w-5" />
                </button>
    
                {/* Encabezado */}
                <div className="flex items-center mb-5">
                    <div className="bg-orange-100 p-2 rounded-full mr-3">
                        <Coffee className="h-6 w-6 text-amber-700" />
                    </div>
                    <h3 className="text-lg font-bold text-amber-900">
                        Consejos para navegar
                    </h3>
                </div>
    
                {/* Lista de consejos */}
                <ul className="space-y-3 text-gray-700 mb-6">
                    <li className="flex items-start">
                        <span className="flex-shrink-0 mr-2 text-amber-600 mt-0.5">•</span>
                        <span>En móvil, desliza arriba y abajo para ver todos los sellos</span>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 mr-2 text-amber-600 mt-0.5">•</span>
                        <span>Desliza horizontalmente para cambiar de página</span>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 mr-2 text-amber-600 mt-0.5">•</span>
                        <span>Toca un sello para ver su detalle</span>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 mr-2 text-amber-600 mt-0.5">•</span>
                        <span>Usa los botones "Anterior" y "Siguiente" para navegar entre páginas</span>
                    </li>
                </ul>
    
                {/* Botón de confirmación */}
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowTips(false)}
                        className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-md hover:from-amber-700 hover:to-amber-600 transition-all shadow-sm font-medium"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <TipsModal />

            <div className="w-full h-screen bg-[#2D1B0E] flex items-center justify-center overflow-hidden p-2">
                {/* Full-screen book container */}
                <div className="relative mx-auto w-full h-full max-h-[90vh] flex justify-center items-center">
                    <HTMLFlipBook
                        ref={bookRef}
                        width={bookDimensions.width}
                        height={bookDimensions.height}
                        className="shadow-2xl rounded-lg"
                        size="fixed"
                        drawShadow={true}
                        flippingTime={800}
                        usePortrait={orientation === 'portrait'}
                        startZIndex={10}
                        autoSize={false}
                        maxShadowOpacity={0.5}
                        showCover={true}
                        mobileScrollSupport={true}
                        useMouseEvents={true}
                        onFlip={handlePageChange}
                        startPage={0}
                        showPageCorners={true}
                        disableFlipByClick={true}
                        swipeDistance={30}
                        clickEventForward={false}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            maxHeight: '90vh',
                        }}
                        minWidth={200}
                        maxWidth={1000}
                        minHeight={100}
                        maxHeight={800}
                    >
                        {/* Cover Page with enhanced styling */}
                        <div className="bg-[#FAFAF8] flex flex-col justify-center items-center h-full rounded-l-lg relative overflow-hidden">
                            {/* Subtle geometric pattern overlay */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzAgMTUgNDUgMCAzMGwxNS0xNSAxNSAxNXptMzAgMC0xNSAxNS0xNS0xNSAxNS0xNSAxNSAxNXoiIGZpbGw9IiMyQzFBMTIiLz48L3N2Zz4=')]"></div>

                            {/* Single thin coffee-colored line along spine */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#2C1A12]/0 via-[#2C1A12]/40 to-[#2C1A12]/0"></div>

                            {/* Album content container */}
                            <div className="w-full h-full flex flex-col items-center justify-center px-6 sm:px-8 py-10">
                                {/* Minimalist coffee bean icon */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 sm:mb-8">
                                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#2C1A12] opacity-90">
                                        <path d="M50 87.5c-13.5 0-24.4-6.9-24.4-15.4 0-4.4 2.8-8.4 7.3-11.7 4.3-3.2 10-5.5 16.4-6.2.8-.1 1.6.5 1.7 1.3.1.8-.5 1.6-1.3 1.7-5.8.7-11.1 2.7-15 5.6-3.5 2.6-5.6 5.7-5.6 9.3 0 6.8 9.3 12.1 20.9 12.1s20.9-5.3 20.9-12.1c0-3.2-1.7-6-4.7-8.3-1.6-1.3-3.5-2.4-5.6-3.2-.7-.3-1.1-1.1-.8-1.8.3-.7 1.1-1.1 1.8-.8 2.4 1 4.5 2.2 6.4 3.6 3.5 2.8 5.6 6.1 5.6 10.4 0 8.6-10.9 15.5-24.4 15.5zm0-25c-13.5 0-24.4-6.9-24.4-15.4 0-8.5 10.9-15.4 24.4-15.4 13.5 0 24.4 6.9 24.4 15.4 0 8.5-10.9 15.4-24.4 15.4zm0-27.5c-11.6 0-20.9 5.3-20.9 12.1s9.3 12.1 20.9 12.1 20.9-5.3 20.9-12.1c0-6.8-9.3-12.1-20.9-12.1z" fill="currentColor" />
                                    </svg>
                                </div>

                                {/* Title with refined typography */}
                                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#2C1A12] tracking-tight mb-3 sm:mb-5">
                                    Cafés de Especialidad
                                </h1>

                                {/* Minimal separator */}
                                <div className="w-10 h-0.5 bg-[#2C1A12]/30 my-4"></div>

                                {/* Elegant subtitle */}
                                <p className="text-[#5C4D42] text-sm sm:text-base font-light max-w-xs text-center leading-relaxed">
                                    Una colección de experiencias sensoriales únicas
                                </p>

                                {/* Minimal "start exploring" button */}
                                <button
                                    onClick={goNext}
                                    className="mt-8 sm:mt-12 px-5 py-2 border border-[#2C1A12]/30 text-[#2C1A12] text-sm rounded-sm
                hover:bg-[#2C1A12]/5 transition-colors group flex items-center"
                                    aria-label="Comenzar exploración"
                                >
                                    Explorar
                                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                {/* Subtle version number */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                    <p className="text-[#2C1A12]/30 text-[10px]">Vol. 01</p>
                                </div>
                            </div>
                        </div>

                        {/* Add content pages here from page.pages with integrated navigation */}

                        {page.map((page) => (
                            <div
                                key={page.id}
                                className="bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col h-full relative overflow-hidden"
                            >
                                {/* Fixed header section */}
                                <div className="flex flex-col items-center w-full justify-center pt-4 pb-2 px-4 sm:px-6 max-w-xs md:max-w-2xl mx-auto flex-shrink-0">
                                    <h2 className="text-lg md:text-2xl font-serif text-orange-900 tracking-tight">{page.title}</h2>
                                    <p className="text-[#5C4D42] text-xs sm:text-sm font-light max-w-xs md:max-w-2xl text-center leading-relaxed mt-1">
                                        {page.description}
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                                    {/* Section title */}
                                    <div className="text-center flex-shrink-0 mb-2 sm:mb-4">
                                        <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-orange-200/20 rounded-full">
                                            <Stamp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-800 mr-2" />
                                            <h3 className="text-xs sm:text-sm md:text-lg font-serif text-orange-900 tracking-tight">
                                                Colección de Sellos
                                            </h3>
                                        </div>
                                    </div>

                                    {/* MOBILE-FRIENDLY SCROLLABLE CONTAINER: Improved for iOS & Android */}
                                    <div
                                        className="flex-1 overflow-y-auto overscroll-contain bg-amber-50/10 px-2 sm:px-4 md:px-6 touch-auto relative"
                                        style={{
                                            WebkitOverflowScrolling: 'touch',
                                            touchAction: 'pan-y' // Explícitamente permite scroll vertical
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        onTouchMove={(e) => e.stopPropagation()} // IMPORTANTE: Descomenta esta línea
                                    >
                                        {/* Scroll indicator for mobile */}
                                        <div className="w-1 h-12 bg-orange-300/20 rounded-full absolute right-1 top-1/3 opacity-60 sm:hidden">
                                            <div className="w-1 h-3 bg-orange-500/60 rounded-full animate-bounce"></div>
                                        </div>

                                        <div
                                            key={`page-${page.id}-stamps`}
                                            className="w-full py-2 pb-16" // Elimina altura fija, añade padding inferior
                                        >
                                            <Prueba id={page.id} />
                                        </div>
                                    </div>

                                    {/* Fixed navigation controls */}
                                    <div className="mt-auto fixed z-10 left-1/4 bottom-0 border-t border-orange-800/10 flex justify-between px-4 py-2 flex-shrink-0 bg-amber-50/80 backdrop-blur-sm">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goPrev();
                                            }}
                                            className="text-xs sm:text-sm text-orange-800/70 flex items-center hover:text-orange-800 px-2 py-1 active:bg-orange-100/50"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Anterior
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goNext();
                                            }}
                                            className="text-xs sm:text-sm text-orange-800/70 flex items-center hover:text-orange-800 px-2 py-1 active:bg-orange-100/50"
                                        >
                                            Siguiente
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Back cover with navigation */}
                        <div className="bg-gradient-to-br from-[#6F4E37] to-[#3E2723] flex flex-col justify-center items-center h-full rounded-r-lg relative">
                            <div className="flex flex-col items-center h-full justify-center p-6 text-center max-w-xs mx-auto">
                                <p className="text-[#d0b9af] text-2xl font-light mb-6">
                                    Gracias por acompañarnos en este recorrido por el mundo del café de especialidad
                                </p>

                                {/* Minimal pour-over coffee illustration */}
                                <div className="w-30 h-30 mb-6 opacity-60">
                                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#2C1A12]">
                                        <path d="M65 30H35c-2.8 0-5 2.2-5 5v5c0 16.6 13.4 30 30 30s30-13.4 30-30v-5c0-2.8-2.2-5-5-5zm0 10H35v-5h30v5z" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <path d="M50 10v15M40 10h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>

                                {/* Signature line */}
                                <div className="w-2xl h-0.5 bg-[#Efb810]/20 my-4"></div>

                                {/* Company name */}
                                <p className="text-[#2C1A12] font-serif text-2xl tracking-wide">ENCAFEINADOS</p>

                                {/* Back button */}
                                <button
                                    onClick={goPrev}
                                    className="mt-10 px-5 py-1.5 border border-[#2C1A12]/30 text-[#2C1A12] text-sm rounded-sm hover:bg-[#2C1A12]/5 transition-colors flex items-center">
                                    <svg className="mr-1.5 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Volver
                                </button>
                            </div>
                        </div>

                    </HTMLFlipBook>
                </div>
            </div>

            {/* Help button fixed at corner of screen */}
            <button
                className="fixed bottom-4 right-4 bg-amber-600 text-white rounded-full p-2 shadow-lg hover:bg-amber-700 transition-colors z-50"
                onClick={() => setShowTips(true)}
                aria-label="Ayuda"
            >
                <Info className="h-5 w-5" />
            </button>
        </>
    );
};