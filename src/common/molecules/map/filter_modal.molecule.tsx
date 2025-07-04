import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, ChevronDown, ChevronUp, Coffee, ArrowLeft } from '@/common/ui/icons';
import { FilterOptions } from '@/common/hooks/map/useBranchSearch';
import { useAttributeCategories, useAttributesByCategory } from '@/api/queries/attributes/attribute_categories.query';

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
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [tempFilterOptions, setTempFilterOptions] = useState<FilterOptions>(filterOptions);
  
  useEffect(() => {
    if (isOpen) {
      setTempFilterOptions({...filterOptions});
    }
  }, [isOpen, filterOptions]);

  const { data: categoriesData } = useAttributeCategories();
  const categories = categoriesData?.categories || [];
  
  const attributesByCategory: Record<number, any[]> = {};
  categories.forEach(category => {
    const { data } = useAttributesByCategory(category.id);
    attributesByCategory[category.id] = data?.attributes || [];
  });
  
  const toggleCategory = (categoryId: number) => {
    setActiveCategory(prev => prev === categoryId ? null : categoryId);
  };
  
  const toggleAttribute = (attributeId: number) => {
    const currentAttributes = tempFilterOptions.attributes || [];
    const newAttributes = currentAttributes.includes(attributeId)
      ? currentAttributes.filter(id => id !== attributeId)
      : [...currentAttributes, attributeId];
    
    setTempFilterOptions(prev => ({
      ...prev,
      attributes: newAttributes
    }));
  };

  const updateTempSortBy = (sortBy: 'distance' | 'rating') => {
    setTempFilterOptions(prev => ({
      ...prev,
      sortBy
    }));
  };

  const updateTempMinRating = (minRating: number) => {
    setTempFilterOptions(prev => ({
      ...prev,
      minRating
    }));
  };

  const toggleTempIsOpen = () => {
    setTempFilterOptions(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  const backToCategories = () => {
    setActiveCategory(null);
  };
  
  const applyFilters = () => {
    updateFilterOptions(tempFilterOptions);
    onClose();
  };

  const resetTempFilters = () => {
    setTempFilterOptions({
      minRating: 0,
      isOpen: false,
      sortBy: 'distance',
      attributes: []
    });
  };
  
  const isAttributeView = activeCategory !== null;
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
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
                  {isAttributeView ? (
                    <div className="flex items-center">
                      <button
                        onClick={backToCategories}
                        className="mr-2 p-2 rounded-full hover:bg-gray-100"
                      >
                        <ArrowLeft size={18} className="text-[#6F4E37]" />
                      </button>
                      <h3 className="text-lg font-bold text-[#2C1810]">
                        {categories.find(c => c.id === activeCategory)?.name}
                      </h3>
                    </div>
                  ) : (
                    <h3 className="text-lg font-bold text-[#2C1810]">Filtrar resultados</h3>
                  )}
                  {totalResults > 0 && !isAttributeView && (
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
              
              {!isAttributeView && (
                <>
                  <div className="mb-6">
                    <h4 className="font-medium text-[#6F4E37] mb-2">Ordenar por</h4>
                    <div className="flex gap-2 flex-wrap">
                      <button 
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          tempFilterOptions.sortBy === 'distance' 
                            ? 'bg-[#6F4E37] text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => updateTempSortBy('distance')}
                      >
                        Distancia
                      </button>
                      <button 
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          tempFilterOptions.sortBy === 'rating' 
                            ? 'bg-[#6F4E37] text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => updateTempSortBy('rating')}
                      >
                        Calificación
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-[#6F4E37] mb-2">Calificación mínima</h4>
                    <div className="flex items-center gap-4 flex-wrap">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <button
                          key={rating}
                          className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                            tempFilterOptions.minRating === rating 
                              ? 'bg-[#6F4E37] text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => updateTempMinRating(rating)}
                        >
                          {rating > 0 ? (
                            <>
                              <Star size={16} className={tempFilterOptions.minRating === rating ? 'fill-white' : 'fill-amber-400'} />
                              <span>{rating}+</span>
                            </>
                          ) : (
                            'Todos'
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-[#6F4E37] mb-2">Estado</h4>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        tempFilterOptions.isOpen
                          ? 'bg-[#6F4E37] text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={toggleTempIsOpen}
                    >
                      <Clock size={18} />
                      <span>Solo abiertos ahora</span>
                      {tempFilterOptions.isOpen && (
                        <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
                      )}
                    </button>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-medium text-[#6F4E37] mb-3">Características</h4>
                    
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all"
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-full mb-2">
                            <Coffee size={18} className="text-[#6F4E37]" />
                          </div>
                          <span className="text-sm font-medium text-gray-800 text-center">
                            {category.name}
                          </span>
                          
                          {(tempFilterOptions.attributes || []).filter(id => 
                            attributesByCategory[category.id]?.some(attr => attr.id === id)
                          ).length > 0 && (
                            <span className="mt-2 bg-amber-500 text-white text-xs rounded-full px-2 py-0.5 inline-flex items-center">
                              {(tempFilterOptions.attributes || []).filter(id => 
                                attributesByCategory[category.id]?.some(attr => attr.id === id)
                              ).length} seleccionados
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {isAttributeView && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Selecciona los atributos que buscas en una cafetería:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {attributesByCategory[activeCategory]?.map((attribute) => (
                      <label
                        key={attribute.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border transition-all ${
                          (tempFilterOptions.attributes || []).includes(attribute.id) 
                            ? 'border-amber-400 bg-amber-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={(tempFilterOptions.attributes || []).includes(attribute.id)}
                          onChange={() => toggleAttribute(attribute.id)}
                          className="w-5 h-5 text-[#6F4E37] border-gray-300 rounded focus:ring-[#6F4E37]"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-800 block">
                            {attribute.name}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {attribute.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 mt-6">
                <button
                  className="flex-1 py-3 border border-[#6F4E37] text-[#6F4E37] rounded-xl font-medium hover:bg-[#6F4E37]/10 transition-colors disabled:opacity-50"
                  onClick={isAttributeView ? backToCategories : resetTempFilters}
                  disabled={!isAttributeView && !hasActiveFilters && 
                    tempFilterOptions.minRating === 0 && 
                    !tempFilterOptions.isOpen && 
                    tempFilterOptions.attributes.length === 0}
                >
                  {isAttributeView ? 'Volver' : 'Restablecer'}
                </button>
                <button
                  className="flex-1 py-3 bg-[#6F4E37] text-white rounded-xl font-medium hover:bg-[#5d4230] transition-colors disabled:opacity-50"
                  onClick={isAttributeView ? backToCategories : applyFilters}
                  disabled={isLoading}
                >
                  {isAttributeView ? 'Guardar' : (isLoading ? 'Aplicando...' : 'Aplicar filtros')}
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