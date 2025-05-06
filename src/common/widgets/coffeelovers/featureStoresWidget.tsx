import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
import { CarouselApi } from "@/common/ui/carousel"
import { useEffect, useRef, useState } from "react";
import { FeaturedCarouselStores } from "@/common/molecules/coffeelover/featuredStores";
import { useApprovedBranches } from "@/api/queries/branches/branch.query";

interface FeaturedStoresWidgetProps {
  globalSearchTerm: string;
  setGlobalSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const FeaturedStoresWidget = ({ 
  globalSearchTerm, 
  setGlobalSearchTerm 
}: FeaturedStoresWidgetProps) => {

  const { data: branches, isLoading, isError } = useApprovedBranches();
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

    const searchTermLower = globalSearchTerm.toLowerCase().trim();
    const filtered = branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchTermLower) ||
        branch.address.toLowerCase().includes(searchTermLower)
    );

    setFilteredBranches(filtered);

  }, [branches, globalSearchTerm]);

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
    <FeaturedCarouselStores
      searchTerm={globalSearchTerm}
      branches={branches}
      filteredBranches={filteredBranches}
      carouselRef={carouselRef}
      setFilteredBranches={setFilteredBranches}
      setSearchTerm={setGlobalSearchTerm}
      handleSearchChange={(e) => setGlobalSearchTerm(e.target.value)}
    />
  )
}