import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
import { useEffect,  useState } from "react";
import { FeaturedCarouselStores } from "@/common/molecules/coffeelover/stores/featured_stores.molecule";
import { useApprovedBranches } from "@/api/queries/branches/branch.query";
import { SearchBranch } from "@/api/types/branches/branches.types";

interface FeaturedStoresWidgetProps {
  globalSearchTerm: string;
  setGlobalSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  apiFilteredBranches?: SearchBranch[]; 
  apiIsLoading?: boolean;
  hasActiveFilters?: boolean; 
}

export const FeaturedStoresWidget = ({ 
  globalSearchTerm, 
  setGlobalSearchTerm,
  apiFilteredBranches,
  apiIsLoading = false,
  hasActiveFilters = false
}: FeaturedStoresWidgetProps) => {

  const { data: branches, isLoading: branchesLoading, isError } = useApprovedBranches();
  const [filteredBranches, setFilteredBranches] = useState<ApprovedBranch[]>([]);
  
  const isLoading = apiIsLoading || branchesLoading;

  useEffect(() => {
  
    if (hasActiveFilters || globalSearchTerm.trim().length > 0) {
      if (apiFilteredBranches) {
        // Convertir los SearchBranch a ApprovedBranch
        const convertedBranches = apiFilteredBranches.map(branch => ({
          id: branch.id,
          name: branch.name,
          address: branch.address,
          latitude: branch.latitude,
          longitude: branch.longitude,
          store_logo: branch.store_logo,
          status: "APPROVED",
          average_rating: branch.average_rating
        } as unknown as ApprovedBranch));
        
        console.log("HOLII",convertedBranches)
        setFilteredBranches(convertedBranches);
        return;
      } else {
        setFilteredBranches([]);
        return;
      }
    }

    if (!branches) return;


   if(apiFilteredBranches){
     
    setFilteredBranches(apiFilteredBranches.map(branch => ({
          id: branch.id,
          name: branch.name,
          address: branch.address,
          latitude: branch.latitude,
          longitude: branch.longitude,
          store_logo: branch.store_logo,
          status: "APPROVED",
          average_rating: branch.average_rating
        } as unknown as ApprovedBranch)));

   }
  }, [branches, globalSearchTerm, apiFilteredBranches, hasActiveFilters]);


  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 w-full max-w-md bg-gray-200 rounded"></div>
        </div>
        <p className="mt-4 text-gray-500">Cargando tiendas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-red-500">Error al cargar las tiendas. Por favor, intenta de nuevo más tarde.</p>
      </div>
    );
  }

  if (!branches || branches.length === 0) {
    return (
      <div className="w-full py-8 text-center border rounded-lg shadow-sm">
        <p className="text-gray-500">No hay tiendas registradas</p>
      </div>
    );
  }

  // Si hay filtros activos pero no hay resultados
  if ((hasActiveFilters || globalSearchTerm.trim().length > 0) && filteredBranches.length === 0 && !isLoading) {
    return (
      <div className="w-full py-12 px-6 text-center border border-gray-200 rounded-lg shadow-md bg-white">
        <div className="flex flex-col items-center space-y-5 max-w-md mx-auto">
          <div className="p-4 rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">No se encontraron resultados</h3>
          <p className="text-gray-600 text-sm md:text-base">
            {globalSearchTerm.trim().length > 0 
              ? `No hay cafeterías que coincidan con "${globalSearchTerm}"`
              : "No se encontraron cafeterías con los filtros seleccionados"
            }
          </p>
          <button 
            onClick={() => setGlobalSearchTerm('')}
            className="mt-3 px-6 py-2.5 text-sm font-medium bg-amber-500 text-white bg-brown-600 hover:bg-brown-700 rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-opacity-50"
          >
            Limpiar búsqueda
          </button>
        </div>
      </div>
    );
  
  }

  return (
    <>
      <FeaturedCarouselStores
      searchTerm={globalSearchTerm}
      branches={filteredBranches}
      filteredBranches={filteredBranches}
      setFilteredBranches={setFilteredBranches}
      setSearchTerm={setGlobalSearchTerm}
      handleSearchChange={(e) => setGlobalSearchTerm(e.target.value)}
    />
    </>


  )
}