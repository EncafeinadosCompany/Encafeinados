import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchBranches, BranchSearchParams } from '@/api/queries/branches/branch.query';
import { SearchBranch } from '@/api/types/branches/branches.types';
import { calculateDistance } from '@/common/utils/map/map_utils';

export interface FilterOptions {
  minRating: number;
  isOpen: boolean;
  sortBy: 'distance' | 'rating';
  attributes: number[]; 
}

export const useBranchSearch = (userLocation?: [number, number]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minRating: 0,
    isOpen: false,
    sortBy: 'distance',
    attributes: []
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const searchParams: BranchSearchParams = useMemo(() => ({
    q: debouncedSearchTerm || undefined,
    minRating: filterOptions.minRating > 0 ? filterOptions.minRating : undefined,
    isOpen: filterOptions.isOpen ? true : undefined,
    lat: userLocation ? userLocation[0] : undefined,
    lng: userLocation ? userLocation[1] : undefined,
    sortBy: filterOptions.sortBy,
    attributes: filterOptions.attributes.length > 0 ? filterOptions.attributes.join(',') : undefined
  }), [debouncedSearchTerm, filterOptions, userLocation]);

  const { data, isLoading, error } = useSearchBranches(searchParams);

  const hasActiveFilters = useMemo(() => {
    return !!searchTerm || filterOptions.minRating > 0 || filterOptions.isOpen || filterOptions.attributes.length > 0;
  }, [searchTerm, filterOptions]);

  const updateFilterOptions = useCallback((newOptions: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterOptions({
      minRating: 0,
      isOpen: false,
      sortBy: 'distance',
      attributes: []
    });
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  const toggleFilterModal = useCallback(() => {
    setIsFilterModalOpen(prev => !prev);
  }, []);

  const mapToCafeFormat = useCallback((branches: SearchBranch[]) => {
    return branches.map(branch => {
      let distance = "Unknown distance";
      let distanceValue = 999;

      if (userLocation) {
        const distanceKm = calculateDistance(
          userLocation[0],
          userLocation[1],
          branch.latitude,
          branch.longitude
        );
        distance = `${distanceKm} km`;
        distanceValue = parseFloat(distanceKm);
      }

      return {
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
        distance,
        distanceValue,
        tags: [] 
      };
    });
  }, [userLocation]);

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