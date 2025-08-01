import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, ArrowLeft } from "@/common/ui/icons";
import { Cafe } from '@/api/types/map/map_search.types';
import { FilterOptions } from '@/common/hooks/map/useBranchSearch'; 
import CafeCard from '@/common/molecules/map/cafe_card.molecule';
import SafeNumericDisplay from '@/common/atoms/common/safe_numeric_display.atom';
import { useAppData } from '@/common/context/app_data.context';

interface MapSidebarProps {
  viewMode: 'map' | 'list';
  showSidebar: boolean;
  sortedCafes: Cafe[];
  activeCafe: number | null;
  favorites: number[];
  searchTerm: string;
  filterOptions: FilterOptions; 
  totalCafeCount: number; 
  hasActiveFilters: boolean;
  setShowSidebar: (show: boolean) => void;
  setViewMode: (mode: 'map' | 'list') => void;
  setActiveCafe: (id: number | null) => void;
  toggleFavorite: (id: number) => void;
  navigateToCafe: (id: number) => void;
  resetFilters: () => void;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
}

const MapSidebar: React.FC<MapSidebarProps> = ({
  viewMode,
  showSidebar,
  sortedCafes,
  activeCafe,
  favorites,
  searchTerm,
  filterOptions, 
  totalCafeCount, 
  hasActiveFilters,
  setShowSidebar,
  setViewMode,
  setActiveCafe,
  toggleFavorite,
  navigateToCafe,
  resetFilters,
  updateFilterOptions
}) => {const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);  }, []);

  return (
    <AnimatePresence>
      {(
        (showSidebar && window.innerWidth < 768) ||
        (viewMode === 'list' && window.innerWidth >= 768)
      ) && (
        <motion.div
          className={`absolute top-0 bottom-0 ${viewMode === 'list' && window.innerWidth >= 768
            ? 'right-0 w-1/2 md:max-w-[390px] xl:max-w-[390px] ' 
            : 'right-0 w-full md:w-96'
            } bg-white z-20 shadow-2xl rounded-l-3xl md:rounded-l-3xl overflow-hidden`}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <div className="h-full flex flex-col">
            <div className="flex-none p-6 pt-20 md:pt-24 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#2C1810] flex items-center gap-2">
                <Coffee size={20} className="text-[#6F4E37]" />
                <span>Cafeterías cercanas</span>
                {sortedCafes.length > 0 && (                  <span className="ml-2 bg-gray-100 text-[#6F4E37] text-xs rounded-full px-2 py-1">
                    <SafeNumericDisplay value={sortedCafes.length} defaultValue="..." />
                  </span>
                )}
              </h2>
              
              <div 
                className="md:hidden relative"
                style={{ width: '60px', height: '60px' }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSidebar(false);
                    if (window.innerWidth < 768) {
                      setViewMode('map');
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                  style={{
                    touchAction: 'manipulation',
                  }}
                  aria-label="Cerrar lista de cafeterías"
                >
                  <ArrowLeft size={20} className="text-[#6F4E37]" />
                </button>
              </div>
            </div>

            {sortedCafes.length > 0 && (
              <div className="flex-none px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Ordenar por:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateFilterOptions({ sortBy: 'distance' })}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        filterOptions.sortBy === 'distance'
                          ? 'bg-[#6F4E37] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Distancia
                    </button>
                    <button
                      onClick={() => updateFilterOptions({ sortBy: 'rating' })}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        filterOptions.sortBy === 'rating'
                          ? 'bg-[#6F4E37] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Calificación
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div 
              className="flex-1 h-full overflow-y-auto p-4 pb-32" 
              style={{ 
                WebkitOverflowScrolling: 'touch', 
                touchAction: 'pan-y',
                overscrollBehavior: 'contain',
                height: 'calc(100% - 80px)' 
              }}
            >              {sortedCafes.length > 0 ? (
                <div className="space-y-4 ">
                  {hasActiveFilters ? (
                    <div className="text-xs text-gray-500 text-center mt-1 mb-3">
                      Mostrando <SafeNumericDisplay value={sortedCafes.length} defaultValue="..." /> de <SafeNumericDisplay value={totalCafeCount} defaultValue="..." /> cafeterías
                      {searchTerm.trim() !== "" && (
                        <span className="ml-1">para "<strong>{searchTerm}</strong>"</span>
                      )}
                      {filterOptions.isOpen && (
                        <span className="ml-1">(solo abiertas)</span>
                      )}
                    </div>
                  ) : null}
                  {sortedCafes.map((cafe, index) => (
                    <CafeCard
                      key={cafe.id}
                      cafe={cafe}
                      index={index}
                      isActive={activeCafe === cafe.id}
                      isFavorite={favorites.includes(cafe.id)}
                      searchTerm={searchTerm}
                      onCardClick={setActiveCafe}
                      onFavoriteToggle={toggleFavorite}
                      onNavigate={navigateToCafe}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-center">
                  <Coffee size={48} className="mx-auto text-gray-300" />
                  <p className="mt-4 text-gray-500">No se encontraron cafeterías con los filtros actuales</p>
                  <button
                    className="mt-2 text-[#6F4E37] underline"
                    onClick={resetFilters}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapSidebar;