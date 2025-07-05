import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, MapIcon } from '@/common/ui/icons';
import L from 'leaflet';

interface FilterIndicatorProps {
  apiHasActiveFilters: boolean;
  sortedCafes: any[];
  cafes: any[];
  clearAllFilters: () => void;
  apiSearchTerm: string;
  isSearchProcessing: boolean;
  mapInstance: L.Map | null;
  setActiveCafe: (id: number | null) => void;
  setShowSidebar: (show: boolean) => void;
}

const FilterIndicator: React.FC<FilterIndicatorProps> = ({
  apiHasActiveFilters,
  sortedCafes,
  cafes,
  clearAllFilters,
  apiSearchTerm,
  isSearchProcessing,
  mapInstance,
  setActiveCafe,
  setShowSidebar
}) => {
  return (
    <>
      <AnimatePresence>
        {apiHasActiveFilters && (
          <motion.div
            className="absolute top-24 left-4 z-[400] bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg pointer-events-auto flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="filter-indicator"
          >
            <Filter size={16} className="text-[#6F4E37]" />
            <span className="text-sm font-medium text-[#6F4E37]">
              Mostrando {sortedCafes.length} de {cafes.length} cafeterías
            </span>
            <button
              className="ml-1 text-[#6F4E37] hover:text-[#5d4230] transition-colors"
              onClick={clearAllFilters}
              aria-label="Limpiar filtros"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {apiSearchTerm && sortedCafes.length > 1 && !isSearchProcessing && (
          <motion.button
            className="absolute top-24 left-[285px] z-[400] bg-[#6F4E37] text-white rounded-full px-3 py-2 shadow-lg pointer-events-auto flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => {
              if (mapInstance && sortedCafes.length > 1) {
                const bounds = new L.LatLngBounds(
                  sortedCafes.map((cafe) => [cafe.latitude, cafe.longitude])
                );

                mapInstance.fitBounds(bounds, {
                  padding: [50, 50],
                  animate: true,
                  duration: 1,
                });
              }

              setActiveCafe(null);

              if (window.innerWidth < 768) {
                setShowSidebar(true);
              }
            }}
          >
            <MapIcon size={16} />
            <span className="text-sm font-medium">Ver todos</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterIndicator;