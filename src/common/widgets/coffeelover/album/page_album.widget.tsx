import { Page, usePageByAlbumQuery } from "@/api/queries/album/album.query";
import HTMLFlipBook from 'react-pageflip';
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Coffee, AlertCircle, Info, X, Stamp } from "lucide-react";
import ListStamps from "./stamps.widget";


export default function PageAlbum () {
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
        console.log("data", data);
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
            <div className="flex flex-col items-center justify-center h-screen bg-amber-50/30 p-6 max-w-full mx-auto">
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
                        <div className="bg-gradient-to-br from-[#F8F6F1] to-[#E8E0D5] flex flex-col justify-center items-center h-full rounded-l-lg relative overflow-hidden">
                            {/* Modern abstract pattern overlay */}
                            <div className="absolute inset-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23432818' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            ></div>

                            {/* Modern spine accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#8C7361]/0 via-[#8C7361]/30 to-[#8C7361]/0"></div>

                            {/* Content container with improved spacing */}
                            <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12 relative z-10">
                                {/* Modern minimalist coffee illustration */}
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-8 transform hover:scale-105 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-[#B2A090]/10 rounded-full transform -translate-y-2"></div>
                                    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Cup base with subtle gradient */}
                                        <path
                                            d="M70 40H30c-3.3 0-6 2.7-6 6v10c0 13.8 11.2 25 25 25s25-11.2 25-25V46c0-3.3-2.7-6-6-6z"
                                            fill="url(#paint0_linear)"
                                            stroke="#7D5A50"
                                            strokeWidth="1.5"
                                        />
                                        <path d="M30 50h40" stroke="#7D5A50" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
                                        <path d="M38 40v-5c0-1.1.9-2 2-2h20c1.1 0 2 .9 2 2v5" stroke="#7D5A50" strokeWidth="1.5" />
                                        <path d="M75 50c3.9 0 7 3.1 7 7s-3.1 7-7 7" stroke="#7D5A50" strokeWidth="1.5" />

                                        {/* Steam lines with animation */}
                                        <path className="origin-bottom animate-[rise_3s_ease-in-out_infinite]" d="M43 25s-2-5 0-10" stroke="#7D5A50" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                                        <path className="origin-bottom animate-[rise_3.5s_ease-in-out_0.5s_infinite]" d="M50 25s-2-8 0-15" stroke="#7D5A50" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
                                        <path className="origin-bottom animate-[rise_2.5s_ease-in-out_1s_infinite]" d="M57 25s2-6 0-12" stroke="#7D5A50" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

                                        {/* Gradient definition */}
                                        <defs>
                                            <linearGradient id="paint0_linear" x1="49" y1="40" x2="49" y2="81" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#FDFBF8" />
                                                <stop offset="1" stopColor="#F0E9E2" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    {/* Subtle shadow effect */}
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#7D5A50]/10 rounded-full blur-sm"></div>
                                </div>

                                {/* Modern typography - Title with animated underline effect */}
                                <div className="group relative mb-2">
                                    <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#4A3728] tracking-wide relative z-10">
                                        {data?.albumTitle || 'Álbum de Café'}
                                    </h1>
                                    <div className="absolute -bottom-1 left-0 right-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-[#8C7361]/20 via-[#8C7361]/40 to-[#8C7361]/20 rounded-full transition-all duration-500 ease-in-out"></div>
                                </div>

                                {/* Subtitle with improved typography */}
                                <p className="text-[#7D5A50] text-sm sm:text-base font-light max-w-xs text-center leading-relaxed mt-2">
                                    Un recorrido por el mundo del café de especialidad
                                </p>

                                {/* Modern separator with animated coffee bean */}
                                <div className="flex items-center my-6 w-32 opacity-80 hover:opacity-100 transition-opacity duration-300">
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#7D5A50]/40 to-transparent flex-grow"></div>
                                    <div className="relative mx-2 group">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#7D5A50] transform rotate-0 group-hover:rotate-12 transition-transform duration-500">
                                            <path d="M12 22c-3 0-5.5-1.5-5.5-3.5 0-1 .6-2 1.6-2.6 1-.7 2.3-1.2 3.7-1.4h.4c-.3.3-.5.7-.5 1.1 0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6c0-.4-.1-.8-.4-1 1.6.2 3 .8 4 1.6.8.6 1.3 1.4 1.3 2.3 0 2-2.5 3.5-5.5 3.5zM12 4c3 0 5.5 1.5 5.5 3.5S15 11 12 11 6.5 9.5 6.5 7.5 9 4 12 4z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-[#7D5A50]/40 via-[#7D5A50]/40 to-transparent flex-grow"></div>
                                </div>

                                {/* Modern explore button */}
                                <button
                                    onClick={goNext}
                                    className="mt-6 px-7 py-3 bg-[#8C7361]/10 text-[#4A3728] text-sm font-medium rounded-md
            hover:bg-[#8C7361]/15 transition-all duration-300 group flex items-center border-b border-[#7D5A50]/10
            hover:shadow-sm focus:outline-none focus:ring focus:ring-[#8C7361]/20"
                                    aria-label="Comenzar exploración"
                                >
                                    <span>Explorar</span>
                                    <svg
                                        className="ml-2 w-4 h-4 transition-all duration-500 transform group-hover:translate-x-1"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M9 6L15 12L9 18"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                {/* Bottom decorative element - modern geometric pattern */}
                                <div className="absolute bottom-12 opacity-10 w-40 transform hover:scale-105 transition-transform duration-500">
                                    <svg viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                        <path d="M40 15h40M20 7.5h80M20 22.5h80" stroke="#4A3728" strokeWidth="0.5" strokeDasharray="1 3" />
                                        <circle cx="40" cy="15" r="3" fill="none" stroke="#4A3728" strokeWidth="0.5" />
                                        <circle cx="80" cy="15" r="3" fill="none" stroke="#4A3728" strokeWidth="0.5" />
                                        <circle cx="60" cy="15" r="5" fill="none" stroke="#4A3728" strokeWidth="0.5" />
                                    </svg>
                                </div>

                                {/* Modern edition badge */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                    <div className="px-4 py-1.5 border-t border-b border-[#7D5A50]/5">
                                        <p className="text-[#7D5A50]/40 text-[10px] tracking-[0.2em]">PRIMERA EDICIÓN</p>
                                    </div>
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
                                            <ListStamps id_page={page.id} />
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
                        <div className="bg-gradient-to-br from-[#403025] to-[#2C1F17] flex flex-col justify-center items-center h-full  rounded-r-lg relative overflow-hidden">
                            {/* Coffee bean pattern overlay */}
                            <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMTBjLTMuNSAwLTYuNSAzLTYuNSA2LjVzMyA2LjUgNi41IDYuNSA2LjUtMyA2LjUtNi41UzIzLjUgMTAgMjAgMTB6bTAgMzBjLTMuNSAwLTYuNS0zLTYuNS02LjVzMy02LjUgNi41LTYuNSA2LjUgMyA2LjUgNi41UzIzLjUgNDAgMjAgNDB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"></div>

                            {/* Spine details */}
                            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#BEA99B]/0 via-[#BEA99B]/20 to-[#BEA99B]/0"></div>

                            {/* Content container */}
                            <div className="flex flex-col items-center h-full justify-center p-6 text-center max-w-xs mx-auto relative z-10">
                                {/* Subtle coffee farm illustration */}
                                <div className="w-16 h-16 mb-6 opacity-30">
                                    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                                        <path d="M20 70h60M25 70V50l10-15h30l10 15v20M35 50h30M40 40v10M60 40v10" stroke="#D2C1B0" strokeWidth="1.5" />
                                        <path d="M50 26v14m-7-7h14" stroke="#D2C1B0" strokeWidth="1" />
                                        <path d="M15 70c1.5-10 3.5-15 7-20s9-7.5 20-10m43 30c-1.5-10-3.5-15-7-20s-9-7.5-20-10" stroke="#D2C1B0" strokeWidth="0.5" strokeDasharray="1 2" />
                                    </svg>
                                </div>

                                {/* Thank you message */}
                                <p className="text-[#D2C1B0] text-lg sm:text-xl font-light mb-6 leading-relaxed">
                                    Gracias por acompañarnos en este recorrido por el mundo del café de especialidad
                                </p>

                                {/* Coffee process illustration */}
                                <div className="flex space-x-6 mb-8 opacity-70">
                                    <div className="w-14 h-14">
                                        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BEA99B]">
                                            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" />
                                            <path d="M20 20c2.5 1.5 5 2 10 0m-10 10c2.5-1.5 5-2 10 0" stroke="currentColor" strokeWidth="1" />
                                            <path d="M25 15v20" stroke="currentColor" strokeWidth="0.5" />
                                        </svg>
                                        <p className="text-[8px] text-[#BEA99B] mt-1 tracking-wider">CULTIVADO</p>
                                    </div>
                                    <div className="w-14 h-14">
                                        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BEA99B]">
                                            <rect x="15" y="15" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                                            <path d="M20 20l10 10m0-10L20 30" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                        <p className="text-[8px] text-[#BEA99B] mt-1 tracking-wider">PROCESADO</p>
                                    </div>
                                    <div className="w-14 h-14">
                                        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BEA99B]">
                                            <path d="M30 30c2.5-2.5 5-7.5 0-15s-10-5-10 0 2.5 10 0 15-10 5-5 0" stroke="currentColor" strokeWidth="1" fill="none" />
                                        </svg>
                                        <p className="text-[8px] text-[#BEA99B] mt-1 tracking-wider">SERVIDO</p>
                                    </div>
                                </div>

                                {/* Signature line */}
                                <div className="w-full max-w-[180px] h-px bg-[#BEA99B]/30 my-6"></div>

                                {/* Company name */}
                                <p className="font-serif text-[#BEA99B] text-2xl tracking-wide relative">
                                    ENCAFEINADOS
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D2C1B0]/10"></span>
                                </p>

                                {/* Back button */}
                                <button
                                    onClick={goPrev}
                                    className="mt-10 px-5 py-2 border border-[#BEA99B]/20 text-[#BEA99B] text-sm rounded-sm 
            hover:bg-[#BEA99B]/10 transition-colors flex items-center"
                                >
                                    <svg className="mr-1.5 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Volver
                                </button>

                                {/* Footer text */}
                                <p className="absolute bottom-4 text-[10px] text-[#BEA99B]/30 tracking-wider">HECHO CON PASIÓN</p>
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