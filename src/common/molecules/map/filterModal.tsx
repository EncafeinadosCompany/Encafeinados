import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock } from '@/common/ui/icons';
import { FilterOptions } from '@/common/hooks/map/useSearchFilter';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: FilterOptions; 
  updateFilterOptions: (options: Partial<FilterOptions>) => void; 
  resetFilters: () => void;
  availableTags: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose,
  filterOptions,
  updateFilterOptions,
  resetFilters,
  availableTags
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
                <h3 className="text-lg font-bold text-[#2C1810]">Filtrar resultados</h3>
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
                  <button 
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      filterOptions.sortBy === 'name' 
                        ? 'bg-[#6F4E37] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => updateFilterOptions({ sortBy: 'name' })}
                  >
                    Nombre A-Z
                  </button>
                </div>
              </div>
              
              {/* Minimum Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-[#6F4E37] mb-2">Calificación mínima</h4>
                <div className="flex items-center gap-4">
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
              
              {/* Type of shop coffee */}
              <div className="mb-6">
                <h4 className="font-medium text-[#6F4E37] mb-2">Tipo de cafetería</h4>
                <div className="flex gap-2 flex-wrap">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        filterOptions.tags?.includes(tag) 
                          ? 'bg-[#6F4E37] text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const updatedTags = filterOptions.tags?.includes(tag)
                          ? filterOptions.tags.filter(t => t !== tag)
                          : [...(filterOptions.tags || []), tag];
                        updateFilterOptions({ tags: updatedTags });
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Status */}
              <div className="mb-8">
                <h4 className="font-medium text-[#6F4E37] mb-2">Estado</h4>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    filterOptions.onlyOpen
                      ? 'bg-[#6F4E37] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => updateFilterOptions({ onlyOpen: !filterOptions.onlyOpen })}
                >
                  <Clock size={18} />
                  <span>Solo abiertos ahora</span>
                </button>
              </div>
              
              <div className="flex gap-4">
                <button
                  className="flex-1 py-3 border border-[#6F4E37] text-[#6F4E37] rounded-xl font-medium hover:bg-[#6F4E37]/10 transition-colors"
                  onClick={resetFilters}
                >
                  Restablecer
                </button>
                <button
                  className="flex-1 py-3 bg-[#6F4E37] text-white rounded-xl font-medium hover:bg-[#5d4230] transition-colors"
                  onClick={onClose}
                >
                  Aplicar filtros
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