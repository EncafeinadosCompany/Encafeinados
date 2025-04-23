import { ApprovedBranch} from "@/api/types/branchesApprovalTypes";
import { CarouselApi } from "@/common/ui/carousel"
import { useApprovedBranches } from "@/api/queries/stores/branchesQueries";
import { useEffect, useRef, useState } from "react";
import { FeaturedCarouselStores } from "@/common/molecules/coffeelover/featuredStores";

export const FeaturedStoresWidget = () => {

const { data: branches, isLoading, isError } = useApprovedBranches();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBranches, setFilteredBranches] = useState<ApprovedBranch[]>([]);
  const carouselRef = useRef<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselRef.current) return;

    const interval = setInterval(() => {
      carouselRef.current?.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (!branches) return;

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchTermLower) ||
        branch.address.toLowerCase().includes(searchTermLower)
    );

    setFilteredBranches(filtered);

  }, [branches, searchTerm]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    
    <FeaturedCarouselStores
    handleSearchChange={handleSearchChange}
    searchTerm={searchTerm}
    branches={branches}
    filteredBranches={filteredBranches}
    carouselRef={carouselRef}
    setFilteredBranches={setFilteredBranches}
    setSearchTerm={setSearchTerm}    
    ></FeaturedCarouselStores>
  )

}