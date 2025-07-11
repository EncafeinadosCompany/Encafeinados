import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/common/atoms/common/loading_spinner.atom';


interface MapLoadingOverlayProps {
  mapLoaded: boolean;
  loadingProgress: number;
  isSearchProcessing: boolean;
}

const MapLoadingOverlay: React.FC<MapLoadingOverlayProps> = ({
  mapLoaded,
  loadingProgress,
  isSearchProcessing
}) => {
  return (
    <>
      <AnimatePresence>
        {!mapLoaded && (
          <motion.div
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center"
            exit={{
              opacity: 0,
              transition: { duration: 0.7, ease: "easeInOut" },
            }}
          >
            <LoadingSpinner
              size="lg"
              progress={loadingProgress}
              message={
                loadingProgress < 30
                  ? "Inicializando mapa..."
                  : loadingProgress < 70
                  ? "Cargando datos de cafeterías..."
                  : loadingProgress < 100
                  ? "Preparando tu experiencia cafetera..."
                  : "¡Listo!"
              }
              className="mb-4"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isSearchProcessing && (
          <motion.div
            className="absolute inset-0 bg-black/10 z-[50] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <svg
                className="animate-spin h-4 w-4 text-[#6F4E37]"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm font-medium text-[#6F4E37]">
                Buscando cafeterías...
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MapLoadingOverlay;