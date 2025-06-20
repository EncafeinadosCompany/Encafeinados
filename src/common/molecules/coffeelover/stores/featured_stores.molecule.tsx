import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
import AutoPlay from "embla-carousel-autoplay";

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
import { useEffect, useState } from "react";
import { use } from "chai";


// Types
interface FeaturedCarouselStoresProps {
  branches: ApprovedBranch[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredBranches: ApprovedBranch[];
  setFilteredBranches: React.Dispatch<React.SetStateAction<ApprovedBranch[]>>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FeaturedCarouselStores = ({
  branches,
  searchTerm,
  setSearchTerm,
  setFilteredBranches,
  filteredBranches,
}: FeaturedCarouselStoresProps) => {

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;



    setCount(api.scrollSnapList().length);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    
  api.on("pointerDown", () => {
    console.log("👆 Tocaste el carrusel");
  });

  api.on("scroll", () => {
    console.log("📦 Se está scrolleando");
  });

  }, [api]);


  console.log("Branches:", count, current);
  return (
    <>

      {/* Content Section */}
      <div className='w-full relative '>
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
          <div className="py-2 h-full">
            <div className="flex justify-between mb-2">
              <h2 className="text-3xl font-light text-gray-700">Cafés Destacados</h2>
            </div>

            <Carousel setApi={setApi} opts={{ align: "start", loop: false,  dragFree: false  }} className="w-full max-w-7xl h-full py-2"
              plugins={[AutoPlay({ delay: 5000 })]}
              

            >
              <CarouselContent className="flex w-full h-full">
                {branches.map((branch, index) => (
                  <CarouselItem
                    key={branch.id}
                    className="basis-full md:basis-1/2 lg:basis-1/3 flex justify-center"
                  >
                    <FeaturedCard
                      branches={branch}
                      current={current}
                      isFeatured={index === 1} // El del centro es featured
                      index={index}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* CarouselNext sigue en la posición original */}
              <div className="absolute top-32 right-12 -translate-x-1/2 z-10 hidden md:block">
                <CarouselNext className="bg-black/10  backdrop-blur-sm" />
              </div>

              {/* CarouselPrevious se mueve abajo, centrado horizontalmente */}
              <div className="absolute top-32 left-12 -translate-x-1/2 z-10 hidden md:block">
                <CarouselPrevious className="bg-black/10 backdrop-blur-sm" />
              </div>
            </Carousel>
          </div>
        )}
        {count > 0 && (
          <div className="flex absolute bottom-0 w-full justify-center mt-4">
            <span className="text-xs text-gray-400">
              Mostrando <span className="font-semibold">{current}</span> de <span className="font-semibold">{count}</span> tiendas destacadas
            </span>
          </div>
        )}
      </div>
    </>
  );
};