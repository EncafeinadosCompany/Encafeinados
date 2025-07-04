import { usePageByAlbumQuery } from "@/api/queries/album/album.query";
import { useRef, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Info, Stamp } from "@/common/ui/icons"
import ListStamps from "./stamps.widget";
import { FrontCover } from "../../../molecules/coffeelover/album/front_cover.molecule";
import { BackCover } from "@/common/molecules/coffeelover/album/back_cover.molecule";
import { TipsModal } from "@/common/molecules/coffeelover/album/tips_modal.molecule";
import { Page } from "@/api/types/album/page.types";

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFlip, Navigation,  Keyboard } from 'swiper/modules';

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PageAlbum() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id_album = searchParams.get("id");
    const swiperRef = useRef<any>(null);
    const [bookDimensions, setBookDimensions] = useState({ width: 300, height: 400 });
    const [currentPage, setCurrentPage] = useState(0);
    const [stampsPerPage, setStampsPerPage] = useState(4);
    const [page, setPage] = useState<Page[]>([]);
    const { data, isLoading, error } = usePageByAlbumQuery(id_album);
    const [orientation, setOrientation] = useState('portrait');
    const [showTips, setShowTips] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (data) {
            setPage(data.pages);
            setTotalPages(data.pages.length + 2); // +2 for front and back cover
        }
    }, [data]);

    // Detección de dispositivo móvil
    useEffect(() => {
        const checkIfMobile = () => {
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth <= 768;
            
            setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // MODIFICADO: Manejador de redimensionamiento para ocupar todo el espacio
        useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const currentOrientation = width > height ? 'landscape' : 'portrait';
            setOrientation(currentOrientation);

            if (isMobile) {
                // MÓVIL: Usar casi toda la pantalla
                const headerHeight = 64; // Header fijo
                const footerHeight = 88; // Footer de navegación
                const padding = 8; // Padding mínimo
                
                const availableHeight = height - headerHeight - footerHeight - padding;
                const availableWidth = width - padding;

                // Usar 98% del espacio disponible
                const newWidth = Math.floor(availableWidth * 0.98);
                const newHeight = Math.floor(availableHeight * 0.98);

                setBookDimensions({
                    width: newWidth,
                    height: newHeight
                });

                // Ajustar sellos según orientación
                if (currentOrientation === 'landscape') {
                    setStampsPerPage(6);
                } else {
                    setStampsPerPage(4);
                }
            } else {
                // DESKTOP: OCUPAR PRACTICAMENTE TODA LA PANTALLA
                const headerHeight = 0; // Sin header visible en desktop
                const footerHeight = 80; // Solo navegación desktop
                const padding = 4; // Padding súper mínimo
                
                const availableHeight = height - headerHeight - footerHeight - padding;
                const availableWidth = width - padding;

                // Usar 99% del espacio disponible en desktop
                const newWidth = Math.floor(availableWidth * 0.99);
                const newHeight = Math.floor(availableHeight * 0.99);

                setBookDimensions({
                    width: newWidth,
                    height: newHeight
                });

                // Ajustar sellos según el ancho disponible
                if (newWidth < 600) {
                    setStampsPerPage(4);
                } else if (newWidth < 900) {
                    setStampsPerPage(6);
                } else if (newWidth < 1200) {
                    setStampsPerPage(8);
                } else {
                    setStampsPerPage(12);
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 300);
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [isMobile]);

    // Funciones de navegación con Swiper
    const goNext = () => {
        console.log('goNext - Página actual:', currentPage);
        if (swiperRef.current && currentPage < totalPages - 1) {
            swiperRef.current.slideNext();
        }
    };

    const goPrev = () => {
        console.log('goPrev - Página actual:', currentPage);
        if (swiperRef.current && currentPage > 0) {
            swiperRef.current.slidePrev();
        }
    };

    const goToPage = (pageNum: number) => {
        console.log(`goToPage - Ir a página ${pageNum}`);
        if (swiperRef.current && pageNum >= 0 && pageNum < totalPages) {
            swiperRef.current.slideTo(pageNum);
        }
        setShowMobileMenu(false);
    };

    // Función de navegación hacia atrás
    const handleGoBack = () => {
        try {
            if (window.history.length > 1) {
                navigate(-1);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error al navegar:', error);
            navigate('/');
        }
    };

    // Manejador de cambio de slide
    const handleSlideChange = (swiper: any) => {
        console.log('Slide cambió a:', swiper.activeIndex);
        setCurrentPage(swiper.activeIndex);
    };

    // Estados de carga
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <Loader2 className="h-12 w-12 text-amber-700 animate-spin mb-4 mx-auto" />
                    <p className="text-amber-900 font-medium text-lg">Cargando álbum...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Error al cargar</h3>
                    <p className="text-gray-600 text-center mb-6">
                        No se pudo cargar el álbum. Verifica tu conexión.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <TipsModal showTips={showTips} setShowTips={setShowTips} />
            
            {/* CORREGIDO: Header solo visible en móvil */}
            {isMobile && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-200 safe-area-top">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleGoBack}
                                className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors rounded-xl px-3 py-2"
                                type="button"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-xl">
                                <Stamp className="w-4 h-4 text-amber-700" />
                                <span className="text-sm font-medium text-amber-900">
                                    {currentPage + 1} / {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="bg-amber-600 text-white px-3 py-2 rounded-xl"
                                type="button"
                            >
                                <div className="w-5 h-5 flex flex-col justify-center gap-1">
                                    <div className="w-full h-0.5 bg-white"></div>
                                    <div className="w-full h-0.5 bg-white"></div>
                                    <div className="w-full h-0.5 bg-white"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AGREGADO: Header de desktop flotante minimalista */}
            {!isMobile && (
                <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 transition-colors rounded-xl px-4 py-2 shadow-lg border border-gray-200"
                        type="button"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Atrás</span>
                    </button>

                    <button 
                        onClick={() => setShowTips(true)}
                        className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-xl transition-colors shadow-lg border border-gray-200"
                        type="button"
                    >
                        <Info className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Menú móvil sin cambios */}
            {isMobile && showMobileMenu && (
                <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowMobileMenu(false)}>
                    <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl transform transition-transform safe-area-top">
                        <div className="p-6 pt-20">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Navegación</h3>
                            
                            <div className="space-y-2 mb-6">
                                <button
                                    onClick={() => goToPage(0)}
                                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                                        currentPage === 0 ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
                                    }`}
                                    type="button"
                                >
                                    📖 Portada
                                </button>
                                
                                {page.map((p, index) => (
                                    <button
                                        key={p.id}
                                        onClick={() => goToPage(index + 1)}
                                        className={`w-full text-left p-3 rounded-xl transition-colors ${
                                            currentPage === index + 1 ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
                                        }`}
                                        type="button"
                                    >
                                        ☕ {p.title}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => goToPage(page.length + 1)}
                                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                                        currentPage === page.length + 1 ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100'
                                    }`}
                                    type="button"
                                >
                                    📕 Contraportada
                                </button>
                            </div>

                            <button
                                onClick={() => setShowTips(true)}
                                className="w-full bg-amber-600 text-white p-3 rounded-xl font-medium"
                                type="button"
                            >
                                <Info className="w-5 h-5 inline mr-2" />
                                Ayuda
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CORREGIDO: Contenedor del libro ocupando TODA la pantalla */}
            <div className={`fixed inset-0 bg-gradient-to-br from-[#2D1B0E] to-[#1A0F0A] ${
                isMobile ? 'pt-16 pb-20' : 'pt-0 pb-20'
            }`}>
               
              {/* CORREGIDO: Contenedor del Swiper sin padding y ocupando todo */}
                <div className="w-full h-full flex items-center justify-center">
                    <div 
                        className="shadow-2xl rounded-lg"
                        style={{ 
                            width: `${bookDimensions.width}px`, 
                            height: `${bookDimensions.height}px` 
                        }}
                    >
                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                console.log('Swiper inicializado con dimensiones:', bookDimensions);
                            }}
                            effect="flip"
                            grabCursor={true}
                            modules={[EffectFlip, Navigation, Keyboard]}
                            className="w-full h-full rounded-lg overflow-hidden"
                            onSlideChange={handleSlideChange}
                            keyboard={{
                                enabled: true,
                            }}
                            allowTouchMove={true}
                            touchRatio={1}
                            threshold={10}
                            longSwipesRatio={0.5}
                            longSwipesMs={300}
                            flipEffect={{
                                slideShadows: true,
                                limitRotation: true,
                            }}
                        >
                            {/* Portada */}
                            <SwiperSlide>
                                <div className="w-full h-full bg-gradient-to-br from-[#F8F6F1] to-[#E8E0D5] flex flex-col justify-center items-center relative overflow-hidden">
                                    <FrontCover data={data} goNext={goNext} />
                                </div>
                            </SwiperSlide>

                            {/* CORREGIDO: Páginas del álbum con mejor aprovechamiento */}
                            {page.map((pageData, pageIndex) => (
                                <SwiperSlide key={pageData.id}>
                                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col relative overflow-hidden">
                                        {/* Header de página más compacto */}
                                        <div className={`flex flex-col items-center w-full justify-center flex-shrink-0 ${
                                            isMobile ? 'pt-3 pb-2 px-3' : 'pt-4 pb-2 px-4'
                                        }`}>
                                            <h2 className={`font-serif text-orange-900 tracking-tight text-center leading-tight ${
                                                isMobile ? 'text-sm' : 'text-lg xl:text-2xl'
                                            }`}>
                                                {pageData.title}
                                            </h2>
                                            <p className={`text-[#5C4D42] font-light text-center leading-tight mt-1 ${
                                                isMobile ? 'text-xs max-w-xs' : 'text-sm xl:text-base max-w-2xl'
                                            }`}>
                                                {pageData.description}
                                            </p>
                                        </div>

                                        {/* Contenido principal */}
                                        <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden relative">
                                            {/* Título de sección */}
                                            <div className="text-center flex-shrink-0 mb-2">
                                                <div className={`inline-flex items-center bg-orange-200/30 rounded-full ${
                                                    isMobile ? 'px-3 py-1' : 'px-4 py-2'
                                                }`}>
                                                    <Stamp className={`text-orange-800 mr-2 ${
                                                        isMobile ? 'h-3 w-3' : 'h-4 w-4 xl:h-5 xl:w-5'
                                                    }`} />
                                                    <h3 className={`font-serif text-orange-900 tracking-tight ${
                                                        isMobile ? 'text-xs' : 'text-sm xl:text-base'
                                                    }`}>
                                                        Colección de Sellos
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Container de sellos ocupando el resto */}
                                            <div
                                                className={`flex-1 overflow-y-auto overscroll-contain relative ${
                                                    isMobile ? 'px-2' : 'px-4 xl:px-6'
                                                }`}
                                                style={{
                                                    WebkitOverflowScrolling: 'touch',
                                                    scrollbarWidth: 'none',
                                                    msOverflowStyle: 'none'
                                                }}
                                            >
                                                {/* Indicador de scroll */}
                                                {isMobile && (
                                                    <div className="absolute right-1 top-4 w-1 h-8 bg-orange-300/30 rounded-full z-10">
                                                        <div className="w-1 h-4 bg-orange-500/60 rounded-full animate-pulse"></div>
                                                    </div>
                                                )}

                                                <div className={`w-full h-full ${isMobile ? 'py-2' : 'py-3'}`}>
                                                    <ListStamps id_page={pageData.id} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}

                            {/* Contraportada */}
                            <SwiperSlide>
                                <div className="w-full h-full bg-gradient-to-br from-[#403025] to-[#2C1F17] flex flex-col justify-center items-center relative overflow-hidden">
                                    <BackCover goPrev={goPrev} />
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>

            {/* Navegación inferior móvil */}
            {isMobile && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-amber-200 safe-area-bottom z-50">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    console.log('=== CLICK ANTERIOR ===');
                                    goPrev();
                                }}
                                disabled={currentPage === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                                    currentPage === 0 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                                }`}
                                type="button"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-sm font-medium">Anterior</span>
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            console.log(`=== CLICK PÁGINA ${i} ===`);
                                            goToPage(i);
                                        }}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            i === currentPage ? 'bg-amber-600' : 'bg-amber-200'
                                        }`}
                                        type="button"
                                        aria-label={`Ir a página ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    console.log('=== CLICK SIGUIENTE ===');
                                    goNext();
                                }}
                                disabled={currentPage === totalPages - 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                                    currentPage === totalPages - 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                                }`}
                                type="button"
                            >
                                <span className="text-sm font-medium">Siguiente</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CORREGIDO: Navegación desktop más elegante */}
            {!isMobile && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-amber-200 rounded-2xl px-8 py-4 shadow-2xl z-50">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => {
                                console.log('=== CLICK ANTERIOR DESKTOP ===');
                                goPrev();
                            }}
                            disabled={currentPage === 0}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-colors text-base font-medium ${
                                currentPage === 0 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-800 hover:scale-105'
                            }`}
                            type="button"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Anterior</span>
                        </button>

                        <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 rounded-xl">
                            <Stamp className="w-5 h-5 text-amber-700" />
                            <span className="text-base font-medium text-amber-900">
                                {currentPage + 1} / {totalPages}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                console.log('=== CLICK SIGUIENTE DESKTOP ===');
                                goNext();
                            }}
                            disabled={currentPage === totalPages - 1}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-colors text-base font-medium ${
                                currentPage === totalPages - 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-800 hover:scale-105'
                            }`}
                            type="button"
                        >
                            <span>Siguiente</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Botón de ayuda flotante móvil */}
            {isMobile && (
                <button
                    className="fixed bottom-24 right-4 bg-amber-600 text-white rounded-full p-3 shadow-lg hover:bg-amber-700 transition-colors z-40"
                    onClick={() => setShowTips(true)}
                    aria-label="Ayuda"
                    type="button"
                >
                    <Info className="h-5 w-5" />
                </button>
            )}

            <style>{`
                .safe-area-top {
                    padding-top: env(safe-area-inset-top);
                }
                .safe-area-bottom {
                    padding-bottom: env(safe-area-inset-bottom);
                }
                .overflow-y-auto::-webkit-scrollbar {
                    display: none;
                }
                .overflow-y-auto {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
};