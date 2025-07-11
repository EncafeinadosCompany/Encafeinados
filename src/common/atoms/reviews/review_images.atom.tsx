import React, { useState, useEffect } from 'react';
import { Image, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from'@/common/ui/icons';

interface ReviewImagesProps {
  images: string[];
}

const ReviewImages: React.FC<ReviewImagesProps> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [selectedImageIndex]);

  useEffect(() => {
    if (selectedImageIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setSelectedImageIndex(null);
          setIsZoomed(false);
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  if (!images || images.length === 0) {
    return null;
  }

  const handleNextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const closeViewer = () => {
    setSelectedImageIndex(null);
    setIsZoomed(false);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mt-3">
        {images.slice(0, images.length > 4 ? 3 : 4).map((imageUrl, index) => (
          <button
            key={index}
            className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden bg-gray-100 border border-amber-100 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            onClick={() => setSelectedImageIndex(index)}
          >
            <img
              src={imageUrl}
              alt={`Foto de reseña ${index + 1}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/100?text=No+disponible";
              }}
            />
          </button>
        ))}

        {images.length > 4 && (
          <button
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100 hover:bg-amber-100 transition-colors"
            onClick={() => setSelectedImageIndex(3)}
          >
            <div className="text-center">
              <span className="text-amber-700 font-medium text-sm">+{images.length - 3}</span>
              <div className="flex justify-center mt-1">
                <Image className="h-3.5 w-3.5 text-amber-600" />
              </div>
            </div>
          </button>
        )}
      </div>

      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999
          }}
          onClick={closeViewer}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white transition-colors"
              onClick={closeViewer}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: '9999px',
                padding: '12px',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <X size={24} />
            </button>
            
            <div 
              className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-full text-white"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: '9999px',
                padding: '4px 12px'
              }}
            >
              {selectedImageIndex + 1} / {images.length}
            </div>
            
            {images.length > 1 && (
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-4 rounded-full text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '16px',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {images.length > 1 && (
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-4 rounded-full text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '16px',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}
            
            <button
              type="button"
              className="absolute bottom-24 right-4 z-10 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              style={{
                position: 'absolute',
                bottom: '96px',
                right: '16px',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: '9999px',
                padding: '12px',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
            
            <div 
              className="h-full w-full flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto'
              }}
            >
              <img
                src={images[selectedImageIndex]}
                alt={`Imagen ${selectedImageIndex + 1}`}
                className={`transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={{
                  maxHeight: isZoomed ? 'none' : '85vh',
                  maxWidth: isZoomed ? 'none' : '90vw',
                  objectFit: 'contain',
                  transition: 'transform 300ms',
                  transform: isZoomed ? 'scale(1.5)' : 'scale(1)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
              />
            </div>
            
            {images.length > 1 && (
              <div 
                className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none"
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div 
                  className="bg-black/50 rounded-full px-4 py-2 flex gap-2 pointer-events-auto"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '9999px',
                    padding: '8px 16px',
                    display: 'flex',
                    gap: '8px'
                  }}
                >
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`w-2.5 h-2.5 rounded-full transition-all ${selectedImageIndex === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(idx);
                      }}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: selectedImageIndex === idx ? 'white' : 'rgba(255, 255, 255, 0.4)',
                        transform: selectedImageIndex === idx ? 'scale(1.25)' : 'scale(1)',
                        transition: 'all 150ms',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <span className="sr-only">Imagen {idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewImages;