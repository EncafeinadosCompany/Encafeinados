import { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';

// Updated stamps with coffee-themed placeholders
const stamps = [
  { name: 'Café Aromático', image: 'https://via.placeholder.com/300/8B4513/FFFFFF?text=Café+Aromático' },
  { name: 'Espresso Intenso', image: 'https://via.placeholder.com/300/654321/FFFFFF?text=Espresso+Intenso' },
  { name: 'Latte Artesanal', image: 'https://via.placeholder.com/300/5D4037/FFFFFF?text=Latte+Artesanal' },
  { name: 'Cappuccino Cremoso', image: 'https://via.placeholder.com/300/6D4C41/FFFFFF?text=Cappuccino' },
  { name: 'Café de Especialidad', image: 'https://via.placeholder.com/300/795548/FFFFFF?text=Especialidad' },
  { name: 'Mocha Delicioso', image: 'https://via.placeholder.com/300/4E342E/FFFFFF?text=Mocha' },
  { name: 'Café de Origen', image: 'https://via.placeholder.com/300/3E2723/FFFFFF?text=Origen' },
  { name: 'Café Colombiano', image: 'https://via.placeholder.com/300/5D4037/FFFFFF?text=Colombiano' },
];

// Function to group stamps into pages
const groupStampsByPage = (stamps: any[], itemsPerPage: number) => {
  const pages = [];
  for (let i = 0; i < stamps.length; i += itemsPerPage) {
    pages.push(stamps.slice(i, i + itemsPerPage));
  }
  return pages;
};

export default function Sellos() {
  const bookRef = useRef<any>(null);
  const [bookDimensions, setBookDimensions] = useState({ width: 400, height: 600 });
  const [currentPage, setCurrentPage] = useState(0);
  const [stampsPerPage, setStampsPerPage] = useState(4);

  // Simplified responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 640) { // Mobile
        setBookDimensions({ 
          width: Math.min(280, width - 40), 
          height: 420 
        });
        setStampsPerPage(2); // Fewer stamps on mobile
      } else if (width < 1024) { // Tablet
        setBookDimensions({ 
          width: Math.min(400, width * 0.5), 
          height: 550 
        });
        setStampsPerPage(4); // Medium number on tablet
      } else { // Desktop
        setBookDimensions({ 
          width: Math.min(450, width * 0.35), 
          height: 600 
        });
        setStampsPerPage(4); // More stamps on desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group stamps into pages based on screen size
  const stampPages = groupStampsByPage(stamps, stampsPerPage);
  // Add cover page
  const pages = [null, ...stampPages];

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

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-amber-50/30 overflow-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#6F4E37] my-4 font-serif">
        Mi Colección de Cafeterías
      </h1>
      
      <div className="relative w-full flex justify-center mb-4">
        <HTMLFlipBook
          ref={bookRef}
          width={bookDimensions.width}
          height={bookDimensions.height}
          className="shadow-xl rounded-lg"
          size="fixed"
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={false}
          maxShadowOpacity={0.3}
          showCover={true}
          mobileScrollSupport={true}
          useMouseEvents={true}
          onFlip={handlePageChange}
          style={{}}
          startPage={0}
          minWidth={0}
          maxWidth={1000}
          minHeight={0}
          maxHeight={1000}
          showPageCorners={true}
          disableFlipByClick={false}
          swipeDistance={0}
          clickEventForward={true}
        >
          {/* Cover Page - Simplified */}
          <div className="bg-gradient-to-br from-[#6F4E37] to-[#3E2723] flex flex-col justify-center items-center h-full rounded-l-lg">
            <div className="bg-amber-50/10 p-4 sm:p-6 rounded-lg border border-amber-200 flex flex-col items-center justify-center h-4/5 w-4/5">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-50 mb-4 text-center font-serif">
                Álbum de Cafeterías
              </h2>
              
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-4">
                <img 
                  src="https://via.placeholder.com/300/3E2723/FFFFFF?text=☕" 
                  alt="Coffee Logo" 
                  className="w-full h-full object-cover rounded-full border-2 border-amber-200"
                />
              </div>
              
              <p className="text-amber-100 text-xs sm:text-sm text-center italic">
                Experiencias de café
              </p>
            </div>
          </div>
          
          {/* Stamp Pages with multiple stamps per page */}
          {pages.slice(1).map((pageStamps, pageIndex) => (
            <div 
              key={pageIndex} 
              className="bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col justify-center items-center h-full"
            >
              <div className="bg-white/90 p-3 sm:p-4 rounded-lg border border-amber-200 shadow-md w-11/12 h-11/12 flex flex-col">
                <h2 className="text-base sm:text-lg font-bold text-center mb-2 text-[#5D3D26] font-serif">
                  Página {pageIndex + 1}
                </h2>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-grow">
                  {pageStamps?.map((stamp, stampIndex) => (
                    <div 
                      key={stampIndex} 
                      className="flex flex-col items-center bg-amber-50/50 p-2 rounded-lg border border-amber-100"
                    >
                      <h3 className="text-xs sm:text-sm font-medium text-center mb-1 text-[#5D3D26]">
                        {stamp.name}
                      </h3>
                      
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 p-1 border border-amber-200 rounded-lg overflow-hidden shadow-sm bg-white">
                        <img 
                          src={stamp.image}
                          alt={stamp.name}
                          className="w-full h-full object-cover rounded" 
                        />
                      </div>
                      
                      <div className="mt-1 sm:mt-2 flex justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border border-dashed border-amber-300 rounded-full flex items-center justify-center bg-amber-50">
                          <span className="text-amber-800 text-[8px] sm:text-xs">Sello</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-2">
                  <p className="text-xs text-[#6F4E37]">
                    {pageIndex + 1} de {pages.length - 1}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Simplified Navigation */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6">
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm transition flex items-center ${
            currentPage === 0 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-[#6F4E37] text-white hover:bg-[#5D3D26]'
          }`}
          aria-label="Página anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        
        <span className="px-2 py-1 sm:px-3 sm:py-2 bg-amber-50 border border-amber-200 rounded-full text-xs sm:text-sm text-[#6F4E37]">
          {currentPage} / {pages.length - 1}
        </span>
        
        <button
          onClick={goNext}
          disabled={currentPage >= pages.length - 1}
          className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm transition flex items-center ${
            currentPage >= pages.length - 1 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-[#6F4E37] text-white hover:bg-[#5D3D26]'
          }`}
          aria-label="Página siguiente"
        >
          Siguiente
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}