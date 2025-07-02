import React from 'react';
import { Search, Filter } from '@/common/ui/icons';
import { Input } from '@/common/ui/input';
import { Button } from '@/common/ui/button';
import { useBranchSearch } from '@/common/hooks/map/useBranchSearch';
import FilterModal from '@/common/molecules/map/filter_modal.molecule';

interface MapSearchFilterProps {
  userLocation?: [number, number];
  onResultsChange?: (results: any[]) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const MapSearchFilterWidget: React.FC<MapSearchFilterProps> = ({
  userLocation,
  onResultsChange,
  searchValue = '',
  onSearchChange
}) => {
  const {
    searchTerm,
    setSearchTerm,
    filterOptions,
    updateFilterOptions,
    resetFilters,
    branches,
    cafes,
    totalBranches,
    count,
    isLoading,
    error,
    isFilterModalOpen,
    toggleFilterModal,
    hasActiveFilters
  } = useBranchSearch(userLocation);

  // Sincronizar con el valor de búsqueda externo
  React.useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
  }, [searchTerm, onSearchChange]);

  React.useEffect(() => {
    if (searchValue !== searchTerm) {
      setSearchTerm(searchValue);
    }
  }, [searchValue, searchTerm, setSearchTerm]);

  // Notificar cambios en los resultados
  React.useEffect(() => {
    if (onResultsChange) {
      onResultsChange(cafes);
    }
  }, [cafes, onResultsChange]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <>
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar cafeterías..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="pl-10 pr-4 py-3 w-full border-gray-200 focus:border-[#6F4E37] focus:ring-[#6F4E37] rounded-xl"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6F4E37]"></div>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={toggleFilterModal}
            className={`px-4 py-3 border-gray-200 hover:border-[#6F4E37] relative ${
              hasActiveFilters ? 'border-[#6F4E37] bg-[#6F4E37]/10' : ''
            }`}
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#6F4E37] rounded-full"></div>
            )}
          </Button>
        </div>
        
        {/* Results Summary */}
        {(searchTerm || hasActiveFilters) && (
          <div className="mt-2 text-sm text-gray-600">
            {isLoading ? (
              'Buscando...'
            ) : error ? (
              <span className="text-red-600">Error al buscar cafeterías</span>
            ) : (
              `${count} de ${totalBranches} cafeterías encontradas`
            )}
          </div>
        )}

        {/* Active Filters Indicator */}
        {hasActiveFilters && !isLoading && (
          <div className="mt-2 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="px-2 py-1 bg-[#6F4E37]/10 text-[#6F4E37] text-xs rounded-full">
                Búsqueda: "{searchTerm}"
              </span>
            )}
            {filterOptions.minRating > 0 && (
              <span className="px-2 py-1 bg-[#6F4E37]/10 text-[#6F4E37] text-xs rounded-full">
                Rating: {filterOptions.minRating}+
              </span>
            )}
            {filterOptions.isOpen && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Solo abiertos
              </span>
            )}
            {filterOptions.sortBy === 'rating' && (
              <span className="px-2 py-1 bg-[#6F4E37]/10 text-[#6F4E37] text-xs rounded-full">
                Por calificación
              </span>
            )}
            <button
              onClick={resetFilters}
              className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={toggleFilterModal}
        filterOptions={filterOptions}
        updateFilterOptions={updateFilterOptions}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        totalResults={count}
        isLoading={isLoading}
      />
    </>
  );
};

export default MapSearchFilterWidget;
