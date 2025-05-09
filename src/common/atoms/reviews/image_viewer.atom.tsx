import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}) => {
  // Prevenir scroll cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Manejar teclas
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowLeft': onPrev(); break;
        case 'ArrowRight': onNext(); break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[99999]"
      onClick={onClose}
    >
      {/* Contenido */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Navegación */}
        <button 
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        
        {/* Contador */}
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white">
          {currentIndex + 1} / {images.length}
        </div>
        
        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-4 rounded-full text-white"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-4 rounded-full text-white"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {/* Imagen */}
        <img 
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-[90vw] object-contain"
          onClick={e => e.stopPropagation()}
        />
        
        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <div className="bg-black/50 rounded-full px-4 py-2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${currentIndex === idx ? 'bg-white' : 'bg-white/40'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Implementar cambio a esta imagen
                  }}
                  aria-label={`Ver imagen ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;