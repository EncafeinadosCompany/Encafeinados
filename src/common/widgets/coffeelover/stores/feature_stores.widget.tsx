import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
import { useEffect,  useState } from "react";
import { FeaturedCarouselStores } from "@/common/molecules/coffeelover/stores/featured_stores.molecule";
import { useApprovedBranches } from "@/api/queries/branches/branch.query";
import { SearchBranch } from "@/api/types/branches/branches.types";

interface FeaturedStoresWidgetProps {
  globalSearchTerm: string;
  setGlobalSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  apiFilteredBranches?: SearchBranch[]; // Branches filtrados por la API
  apiIsLoading?: boolean;
}

export const FeaturedStoresWidget = ({ 
  globalSearchTerm, 
  setGlobalSearchTerm,
  apiFilteredBranches,
  apiIsLoading = false
}: FeaturedStoresWidgetProps) => {

  const { data: branches, isLoading: branchesLoading, isError } = useApprovedBranches();
  const [filteredBranches, setFilteredBranches] = useState<ApprovedBranch[]>([]);
  
  // Usar isLoading combinado de API y branches
  const isLoading = apiIsLoading || branchesLoading;

  useEffect(() => {
    // Si tenemos resultados filtrados de la API, los usamos preferentemente
    if (apiFilteredBranches && apiFilteredBranches.length > 0) {
      // Convertir los SearchBranch a ApprovedBranch (simplificado, ajustar según tus tipos)
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
      
      setFilteredBranches(convertedBranches);
      return;
    }
    
    // Filtrado local si no hay resultados de API o no estamos usando API
    if (!branches) return;

    const searchTermLower = globalSearchTerm.toLowerCase().trim();
    const filtered = branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchTermLower) ||
        branch.address.toLowerCase().includes(searchTermLower)
    );

    setFilteredBranches(filtered);

  }, [branches, globalSearchTerm, apiFilteredBranches]);

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

  return (
    <>
        <FeaturedCarouselStores
      searchTerm={globalSearchTerm}
      branches={branches}
      filteredBranches={filteredBranches}
      setFilteredBranches={setFilteredBranches}
      setSearchTerm={setGlobalSearchTerm}
      handleSearchChange={(e) => setGlobalSearchTerm(e.target.value)}
    />
    {/* <DialogDetailStores details={branches[0]} setIsOpen={()=> true}></DialogDetailStores> */}
    </>


  )
}