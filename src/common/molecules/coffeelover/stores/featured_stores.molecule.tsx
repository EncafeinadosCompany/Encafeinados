import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
// UI Components
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/common/ui/carousel";
import FeaturedCard from "@/common/molecules/coffeelover/stores/featured_card.molecule";
// Animation
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Types
interface FeaturedCarouselStoresProps {
  branches: ApprovedBranch[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredBranches: ApprovedBranch[];
  setFilteredBranches: React.Dispatch<React.SetStateAction<ApprovedBranch[]>>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  carouselRef: React.MutableRefObject<CarouselApi | null>;
}

export const FeaturedCarouselStores = ({
  branches,
  searchTerm,
  setSearchTerm,
  setFilteredBranches,
  filteredBranches,
  carouselRef
}: FeaturedCarouselStoresProps) => {

 

  return (
    <>

      {/* Content Section */}
      <div className='w-full'>
        {/* No Results State */}
        {filteredBranches.length === 0 ? (
          <div className="w-full py-8 text-center border-none">
            <p className="text-gray-500">
              No se encontraron tiendas con los términos "{searchTerm}"
            </p>
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
          <div className="py-2 relative">
            <div className="flex justify-between mb-2">
              <h2 className="text-3xl font-light text-gray-700">Cafés Destacados</h2>
              <span className="text-gray-400">
                01/{branches.length}
              </span>
            </div>

            <Carousel opts={{ align: "center" }} className="w-full max-w-7xl h-full py-2">
              <CarouselContent>
              {branches.map((branch, index) => (
                <CarouselItem
                key={branch.id}
                className="md:basis-1/2 lg:basis-1/3 items-center flex justify-center p-4"
                >
                <FeaturedCard
                  branches={branch}
                  isFeatured={index === 1} // El del centro es featured
                />
                </CarouselItem>
              ))}
              </CarouselContent>
              {/* CarouselNext sigue en la posición original */}
               <div className="absolute bottom-4 right-12 -translate-x-1/2 z-10">
                <CarouselNext className="bg-white/80 backdrop-blur-sm" />
               </div>
             
              {/* CarouselPrevious se mueve abajo, centrado horizontalmente */}
              <div className="absolute bottom-4 left-12 -translate-x-1/2 z-10">
              <CarouselPrevious className="bg-white/80 backdrop-blur-sm" />
              </div>
            </Carousel>

            {/* Dots/Indicadores de navegación (opcional) */}
            <div className="flex justify-center gap-2 mt-6">
              {branches.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 transition-all duration-300 rounded-full ${index === 1 ? "bg-gray-600 w-10" : "bg-gray-300 w-6"
                    }`}
                  aria-label={`Ver café ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};