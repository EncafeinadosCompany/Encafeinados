import { useState, useCallback, useMemo } from 'react';
import { Cafe } from '@/common/types/map/mapTypes';

// Definir la interfaz para las opciones de filtro
export interface FilterOptions {
  minRating: number;
  onlyOpen: boolean;
  tags: string[];
  sortBy: 'distance' | 'rating' | 'name';
}

export const useSearchFilter = (cafes: Cafe[]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minRating: 0,
    onlyOpen: false,
    tags: [],
    sortBy: 'distance'
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Función segura para buscar coincidencias en texto
  const safeTextSearch = (text: unknown, term: string): boolean => {
    if (!text || typeof text !== 'string') return false;
    return text.toLowerCase().includes(term);
  };

  // Filtrar cafés basado en el término de búsqueda y filtros
  const filteredCafes = useMemo(() => {
    // Si no hay filtros activos, devolver todos los cafés
    if (!cafes) return [];
    
    if (!searchTerm && filterOptions.minRating === 0 && !filterOptions.onlyOpen && filterOptions.tags.length === 0) {
      return cafes;
    }
    
    return cafes.filter(cafe => {
      // Validar que cafe existe y es un objeto
      if (!cafe || typeof cafe !== 'object') return false;
      
      // Búsqueda de texto mejorada
      if (searchTerm) {
        const query = searchTerm.toLowerCase().trim();
        const terms = query.split(/\s+/).filter(Boolean); // Filtrar términos vacíos
        
        // Si no hay términos válidos después de limpiar, mostrar todos
        if (terms.length === 0) return true;
        
        // Verifica si TODOS los términos de búsqueda están en algún campo
        const matchesAllTerms = terms.every(term => 
          safeTextSearch(cafe.name, term) || 
          safeTextSearch(cafe.address, term) ||
          safeTextSearch(cafe.storeName, term) ||
          (Array.isArray(cafe.tags) && cafe.tags.some(tag => safeTextSearch(tag, term)))
        );
        
        if (!matchesAllTerms) return false;
      }
      
      // Filtro de calificación mínima (con valor predeterminado si rating es undefined)
      const cafeRating = typeof cafe.rating === 'number' ? cafe.rating : 0;
      const meetsRating = cafeRating >= filterOptions.minRating;
      
      // Filtro de abierto/cerrado (con valor predeterminado)
      const isOpenFilter = !filterOptions.onlyOpen || cafe.isOpen === true;
      
      // Filtro de etiquetas (con comprobación de array)
      const hasMatchingTags = filterOptions.tags.length === 0 || 
        (Array.isArray(cafe.tags) && filterOptions.tags.some(tag => cafe.tags.includes(tag)));
      
      return meetsRating && isOpenFilter && hasMatchingTags;
    });
  }, [cafes, searchTerm, filterOptions]);
  
  // Ordenar cafés según el criterio seleccionado
  const sortedCafes = useMemo(() => {
    if (!filteredCafes.length) return [];
    
    const sorted = [...filteredCafes];
    
    switch (filterOptions.sortBy) {
      case 'distance':
        return sorted.sort((a, b) => {
          const distA = typeof a.distanceValue === 'number' ? a.distanceValue : Infinity;
          const distB = typeof b.distanceValue === 'number' ? b.distanceValue : Infinity;
          return distA - distB;
        });
      case 'rating':
        return sorted.sort((a, b) => {
          const ratingA = typeof a.rating === 'number' ? a.rating : 0;
          const ratingB = typeof b.rating === 'number' ? b.rating : 0;
          return ratingB - ratingA;
        });
      case 'name':
        return sorted.sort((a, b) => {
          const nameA = typeof a.name === 'string' ? a.name : '';
          const nameB = typeof b.name === 'string' ? b.name : '';
          return nameA.localeCompare(nameB);
        });
      default:
        return sorted;
    }
  }, [filteredCafes, filterOptions.sortBy]);
  
  // Actualizar las opciones de filtro con tipo correcto
  const updateFilterOptions = useCallback((newOptions: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  }, []);
  
  // Restablecer todos los filtros
  const resetFilters = useCallback(() => {
    setFilterOptions({
      minRating: 0,
      onlyOpen: false,
      tags: [],
      sortBy: 'distance'
    });
    setSearchTerm('');
  }, []);
  
  // Manejar la apertura/cierre del modal de filtros
  const toggleFilterModal = useCallback(() => {
    setIsFilterModalOpen(prev => !prev);
  }, []);
  
  return {
    searchTerm,
    setSearchTerm,
    filterOptions,
    updateFilterOptions,
    resetFilters,
    sortedCafes,
    filteredCafes,
    isFilterModalOpen,
    toggleFilterModal
  };
};