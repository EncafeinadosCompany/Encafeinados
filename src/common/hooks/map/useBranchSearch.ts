import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchBranches, BranchSearchParams } from '@/api/queries/branches/branch.query';
import { SearchBranch } from '@/api/types/branches/branches.types';

export interface FilterOptions {
  minRating: number;
  isOpen: boolean;
  sortBy: 'distance' | 'rating';
}

export const useBranchSearch = (userLocation?: [number, number]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minRating: 0,
    isOpen: false,
    sortBy: 'distance'
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const searchParams: BranchSearchParams = useMemo(() => {
    const params = {
      q: debouncedSearchTerm || undefined,
      minRating: filterOptions.minRating > 0 ? filterOptions.minRating : undefined,
      isOpen: filterOptions.isOpen ? true : undefined,
      lat: userLocation ? userLocation[0] : undefined,
      lng: userLocation ? userLocation[1] : undefined,
      sortBy: filterOptions.sortBy
    };
    console.log('Search params changed:', params);
    return params;
  }, [debouncedSearchTerm, filterOptions, userLocation]);

  const { data, isLoading, error } = useSearchBranches(searchParams);

  const hasActiveFilters = useMemo(() => {
    return !!searchTerm || filterOptions.minRating > 0 || filterOptions.isOpen;
  }, [searchTerm, filterOptions]);

  const updateFilterOptions = useCallback((newOptions: Partial<FilterOptions>) => {
    console.log('Updating filter options:', newOptions);
    setFilterOptions(prev => {
      const updated = { ...prev, ...newOptions };
      console.log('New filter options:', updated);
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilterOptions({
      minRating: 0,
      isOpen: false,
      sortBy: 'distance'
    });
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  const toggleFilterModal = useCallback(() => {
    setIsFilterModalOpen(prev => !prev);
  }, []);

  const mapToCafeFormat = useCallback((branches: SearchBranch[]) => {
    console.log('Mapping branches:', branches);
    return branches.map(branch => {
      const mapped = {
        id: branch.id,
        name: branch.name,
        rating: parseFloat(branch.average_rating),
        reviewCount: 0, 
        openTime: "", 
        image: branch.store_logo,
        isOpen: branch.isOpen,
        latitude: branch.latitude,
        longitude: branch.longitude,
        address: branch.address,
        status: "APPROVED",
        storeId: 0, 
        storeName: "", 
        distanceValue: 0,
        distanceText: "",
        tags: [] 
      };
      console.log(`Branch ${branch.name}: isOpen=${branch.isOpen} -> mapped=${mapped.isOpen}`);
      return mapped;
    });
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filterOptions,
    updateFilterOptions,
    resetFilters,
    branches: data?.branches || [],
    cafes: data?.branches ? mapToCafeFormat(data.branches) : [],
    totalBranches: data?.totalBranches || 0,
    count: data?.count || 0,
    isLoading,
    error,
    isFilterModalOpen,
    toggleFilterModal,
    hasActiveFilters
  };
};