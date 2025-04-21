import { useApprovedBranches } from "@/api/queries/stores/branchesQueries"
import { ApprovedBranch} from "@/api/types/branchesApprovalTypes";
import SearchCoffee from "@/common/atoms/search";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/common/ui/carousel"

import FeaturedCard from "@/common/molecules/coffeelover/featureCard"
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const FeaturedCarouselStores = () => {
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
    <div>
      <div>
        <SearchCoffee
          value={searchTerm}
          onChange={handleSearchChange}
          className='mb-5'
        />
      </div>
      <div className='w-full'>
        <h2 className="text-xl font-bold mb-4">Destacados</h2>
        {filteredBranches.length === 0 ? (
          <div className="w-full py-8 text-center border-none">
            <p className="text-gray-500">No se encontraron tiendas con los términos "{searchTerm}"</p>
            <button
                onClick={(e) => {
                e.preventDefault();
                setSearchTerm('');
                if (branches) {
                  setFilteredBranches(branches);
                }
              }}
              className="mt-3 text-blue-500 hover:text-blue-700 underline"
            >
              Mostrar todas las tiendas
            </button>
          </div>
        ) : (
          <Carousel
          className="flex justify-center items-center touch-pan-y"
          opts={{ 
            loop: true, 
            align: "center",
            dragFree: true,
            containScroll: "trimSnaps"
          }}
            setApi={(api) => (carouselRef.current = api)}
          >
            <div className="relative w-full">
              <CarouselContent className="cursor-grab active:cursor-grabbing">
                {filteredBranches.map((branch) => (
                  <CarouselItem key={branch.id} className="basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4 touch-pan-x">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="touch-pan-x"
                    >
                      <FeaturedCard
                        branches={branch}        
                      />
                    </motion.div>
                  </CarouselItem>
                  
                ))}
              </CarouselContent>

              <CarouselPrevious className=" flex absolute left-0 top-1/3 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10" />
              <CarouselNext className=" flex absolute right-0 top-1/3 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10" />
            </div>
          </Carousel>
        )}
      </div>
      
    </div>
  )
}