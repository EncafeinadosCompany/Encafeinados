import { useState, useCallback, useMemo } from 'react';
import { Cafe } from '@/common/types/map/mapTypes';

// Definir la interfaz para las opciones de filtro
export interface FilterOptions {
  minRating: number; // Quitamos el signo ? para hacerlo obligatorio
  onlyOpen: boolean; // Quitamos el signo ? para hacerlo obligatorio
  tags: string[]; // Quitamos el signo ? para hacerlo obligatorio
  sortBy: 'distance' | 'rating' | 'name'; // Quitamos el signo ? para hacerlo obligatorio
}

export const useSearchFilter = (cafes: Cafe[]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minRating: 0, // Valor predeterminado
    onlyOpen: false, // Valor predeterminado
    tags: [], // Valor predeterminado
    sortBy: 'distance' // Valor predeterminado
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Filtrar cafés basado en el término de búsqueda y filtros
  const filteredCafes = useMemo(() => {
    if (!searchTerm && filterOptions.minRating === 0 && !filterOptions.onlyOpen && filterOptions.tags.length === 0) {
      return cafes;
    }
    
    return cafes.filter(cafe => {
      // Búsqueda de texto mejorada
      if (searchTerm) {
        const query = searchTerm.toLowerCase().trim();
        const terms = query.split(/\s+/);
        
        // Verifica si TODOS los términos de búsqueda están en algún campo
        const matchesAllTerms = terms.every(term => 
          cafe.name.toLowerCase().includes(term) || 
          cafe.address.toLowerCase().includes(term) ||
          cafe.storeName.toLowerCase().includes(term) ||
          (cafe.tags && cafe.tags.some(tag => tag.toLowerCase().includes(term)))
        );
        
        if (!matchesAllTerms) return false;
      }
      
      // Filtro de calificación mínima
      const meetsRating = cafe.rating >= filterOptions.minRating;
      
      // Filtro de abierto/cerrado
      const isOpenFilter = !filterOptions.onlyOpen || cafe.isOpen;
      
      // Filtro de etiquetas
      const hasMatchingTags = filterOptions.tags.length === 0 || 
        filterOptions.tags.some(tag => cafe.tags.includes(tag));
      
      return meetsRating && isOpenFilter && hasMatchingTags;
    });
  }, [cafes, searchTerm, filterOptions]);
  
  // Ordenar cafés según el criterio seleccionado
  const sortedCafes = useMemo(() => {
    const sorted = [...filteredCafes];
    
    switch (filterOptions.sortBy) {
      case 'distance':
        return sorted.sort((a, b) => a.distanceValue - b.distanceValue);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
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