import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock } from '@/common/ui/icons';
import { FilterOptions } from '@/common/hooks/map/useBranchSearch';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: FilterOptions; 
  updateFilterOptions: (options: Partial<FilterOptions>) => void; 
  resetFilters: () => void;
  hasActiveFilters?: boolean;
  totalResults?: number;
  isLoading?: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose,
  filterOptions,
  updateFilterOptions,
  resetFilters,
  hasActiveFilters = false,
  totalResults = 0,
  isLoading = false
}) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#2C1810]">Filtrar resultados</h3>
                  {totalResults > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {isLoading ? 'Buscando...' : `${totalResults} cafeterías encontradas`}
                    </p>
                  )}
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              {/* Order by */}
              <div className="mb-6">
                <h4 className="font-medium text-[#6F4E37] mb-2">Ordenar por</h4>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      filterOptions.sortBy === 'distance' 
                        ? 'bg-[#6F4E37] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => updateFilterOptions({ sortBy: 'distance' })}
                  >
                    Distancia
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      filterOptions.sortBy === 'rating' 
                        ? 'bg-[#6F4E37] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => updateFilterOptions({ sortBy: 'rating' })}
                  >
                    Calificación
                  </button>
                </div>
              </div>
              
              {/* Minimum Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-[#6F4E37] mb-2">Calificación mínima</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                        filterOptions.minRating === rating 
                          ? 'bg-[#6F4E37] text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => updateFilterOptions({ minRating: rating })}
                    >
                      {rating > 0 ? (
                        <>
                          <Star size={16} className={filterOptions.minRating === rating ? 'fill-white' : 'fill-amber-400'} />
                          <span>{rating}+</span>
                        </>
                      ) : (
                        'Todos'
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Status */}
              <div className="mb-8">
                <h4 className="font-medium text-[#6F4E37] mb-2">Estado</h4>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    filterOptions.isOpen
                      ? 'bg-[#6F4E37] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => updateFilterOptions({ isOpen: !filterOptions.isOpen })}
                >
                  <Clock size={18} />
                  <span>Solo abiertos ahora</span>
                  {filterOptions.isOpen && (
                    <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
                  )}
                </button>
              </div>
              
              <div className="flex gap-4">
                <button
                  className="flex-1 py-3 border border-[#6F4E37] text-[#6F4E37] rounded-xl font-medium hover:bg-[#6F4E37]/10 transition-colors disabled:opacity-50"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                >
                  Restablecer
                </button>
                <button
                  className="flex-1 py-3 bg-[#6F4E37] text-white rounded-xl font-medium hover:bg-[#5d4230] transition-colors disabled:opacity-50"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {isLoading ? 'Aplicando...' : 'Aplicar filtros'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;