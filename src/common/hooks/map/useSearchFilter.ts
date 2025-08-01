import { useState, useCallback, useMemo } from 'react';
import { Cafe } from '@/api/types/map/map_search.types';

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
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const safeTextSearch = (text: unknown, term: string): boolean => {
    if (!text || typeof text !== 'string') return false;
    return text.toLowerCase().includes(term);
  };

  const filteredCafes = useMemo(() => {
    if (!cafes) return [];
    
    if (!searchTerm && filterOptions.minRating === 0 && !filterOptions.onlyOpen && filterOptions.tags.length === 0) {
      return cafes;
    }
    
    return cafes.filter(cafe => {
      if (!cafe || typeof cafe !== 'object') return false;
      
      if (searchTerm) {
        const query = searchTerm.toLowerCase().trim();
        const terms = query.split(/\s+/).filter(Boolean); // Filtrar términos vacíos
        
        if (terms.length === 0) return true;
        
        const matchesAllTerms = terms.every(term => 
          safeTextSearch(cafe.name, term) || 
          safeTextSearch(cafe.address, term) ||
          safeTextSearch(cafe.storeName, term) ||
          (Array.isArray(cafe.tags) && cafe.tags.some(tag => safeTextSearch(tag, term)))
        );
        
        if (!matchesAllTerms) return false;
      }
      
      const cafeRating = typeof cafe.rating === 'number' ? cafe.rating : 0;
      const meetsRating = cafeRating >= filterOptions.minRating;
      
      const isOpenFilter = !filterOptions.onlyOpen || cafe.isOpen === true;
      
      const hasMatchingTags = filterOptions.tags.length === 0 || 
        (Array.isArray(cafe.tags) && filterOptions.tags.some(tag => cafe.tags.includes(tag)));
      
      return meetsRating && isOpenFilter && hasMatchingTags;
    });
  }, [cafes, searchTerm, filterOptions]);   
  const hasActiveFiltersCalculated = useMemo(() => {
    const hasSearchTerm = Boolean(searchTerm.trim());
    
    const hasCustomFilters = Object.entries(filterOptions).some(([key, value]) => {
      if (key === 'sortBy' && value === 'distance') return false;
      
      if (
        (key === 'minRating' && value === 0) ||
        (key === 'onlyOpen' && value === false) ||
        (key === 'tags' && (!value || value.length === 0))
      ) {
        return false;
      }
      
      return true;
    });
      const result = hasSearchTerm || hasCustomFilters;
    
    return result;
  }, [searchTerm, filterOptions]);

  const sortedCafes = useMemo(() => {
    let filtered = [...cafes];
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(cafe => 
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cafe.address && cafe.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterOptions.minRating > 0) {
      filtered = filtered.filter(cafe => cafe.rating >= filterOptions.minRating);
    }
    
    setHasActiveFilters(hasActiveFiltersCalculated);
    
    const sorted = [...filtered];
    
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
  }, [cafes, searchTerm, filterOptions]);

  const updateFilterOptions = useCallback((newOptions: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilterOptions({
      minRating: 0,
      onlyOpen: false,
      tags: [],
      sortBy: 'distance'
    });
    setSearchTerm('');
  }, []);
  
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
    toggleFilterModal,
    hasActiveFilters
  };
};