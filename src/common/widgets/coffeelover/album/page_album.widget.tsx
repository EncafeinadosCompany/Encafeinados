import { Page, usePageByAlbumQuery } from "@/api/queries/album/album.query";
import HTMLFlipBook from 'react-pageflip';



import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2,AlertCircle, Info, Stamp } from "lucide-react";
import ListStamps from "./stamps.widget";
import { FrontCover } from "../../../molecules/coffeelover/album/front_cover.molecule";
import { BackCover } from "@/common/molecules/coffeelover/album/back_cover.molecule";
import { TipsModal } from "@/common/molecules/coffeelover/album/tips_modal.molecule";


export default function PageAlbum() {
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


    // const pageFlip = new PageFlip(htmlParentElement, settings);
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

    return (
        <>
            <TipsModal showTips={showTips} setShowTips={setShowTips} />
            <button
                onClick={() => window.history.back()}
                className="absolute top-4 left-4 z-50 bg-white/90 hover:bg-white shadow-md text-amber-800 p-2 rounded-full transition-colors sm:top-6 sm:left-6"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

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
                        disableFlipByClick={false}
                        swipeDistance={30}
                        clickEventForward={true}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '90vh'}}
                        minWidth={200}
                        maxWidth={1000}
                        minHeight={100}
                        maxHeight={800}
                    >
                        {/* Cover Page with enhanced styling */}
                        <div className=" bg-gradient-to-br from-[#F8F6F1] to-[#E8E0D5] flex flex-col justify-center items-center h-full rounded-l-lg relative overflow-hidden">
                            <FrontCover data={data} goNext={goNext}/>
                        </div>

                        {/* Add content pages here from page.pages with integrated navigation */}

                        {page.map((page) => (
                            <div
                                key={page.id}
                                className="bg-gradient-to-br  from-amber-50 to-amber-100 flex flex-col h-full relative overflow-hidden"
                            >
                                {/* Fixed header section */}
                                <div className="flex flex-col items-center w-full justify-center pt-4 pb-2 px-4 sm:px-6 max-w-xs md:max-w-2xl mx-auto flex-shrink-0">
                                    <h2 className="text-lg md:text-2xl font-serif text-orange-900 tracking-tight">{page.title}</h2>
                                    <p className="text-[#5C4D42] text-xs sm:text-sm font-light max-w-xs md:max-w-2xl text-center leading-relaxed mt-1">
                                        {page.description}
                                    </p>
                                </div>

                                <div className="flex-1 flex absolute flex-col min-h-0 w-full overflow-hidden">
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
                                        className="flex-1 overflow-y-auto overscroll-contain  px-2 sm:px-4 md:px-6 touch-auto relative"
                                        style={{
                                            WebkitOverflowScrolling: 'touch',
                                            // touchAction: 'pan-y'
                                            touchAction: 'none',
                                        }}
                                    >
                                        {/* Scroll indicator for mobile */}
                                        <div className="w-1 h-6 bg-orange-300/20 rounded-full absolute right-1 top-1/3 opacity-60 sm:hidden">
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
                                    <div className="mt-auto fixed z-10 left-1/3 bottom-0 border-t border-orange-800/10 flex justify-between px-4 py-2 flex-shrink-0 bg-amber-50/80 backdrop-blur-sm">
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
                           <BackCover goPrev={goPrev} />
                        </div>
                    </HTMLFlipBook>
                </div>
            </div>

            {/* Help button fixed at corner of screen */}
            <button className="fixed bottom-4 right-4 bg-amber-600 text-white rounded-full p-2 shadow-lg hover:bg-amber-700 transition-colors z-50"
                onClick={() => setShowTips(true)}
                aria-label="Ayuda">
                <Info className="h-5 w-5" />
            </button>
        </>
    );
};