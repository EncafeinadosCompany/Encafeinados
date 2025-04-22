
import { ApprovedBranch} from "@/api/types/branchesApprovalTypes";
import SearchCoffee from "@/common/atoms/search";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/common/ui/carousel"

import FeaturedCard from "@/common/molecules/coffeelover/featureCard"
import { motion } from "framer-motion";


interface FeaturedCarouselStoresProps {
  branches: ApprovedBranch[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredBranches: ApprovedBranch[];
  setFilteredBranches: React.Dispatch<React.SetStateAction<ApprovedBranch[]>>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  carouselRef: React.MutableRefObject<CarouselApi | null>;


}


export const FeaturedCarouselStores = ({branches, searchTerm, handleSearchChange, setSearchTerm, setFilteredBranches, filteredBranches, carouselRef }:FeaturedCarouselStoresProps) => {
  

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