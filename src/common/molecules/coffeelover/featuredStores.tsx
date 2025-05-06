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
import FeaturedCard from "@/common/molecules/coffeelover/featureCard";
// Animation
import { motion } from "framer-motion";

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
  handleSearchChange,
  setSearchTerm,
  setFilteredBranches,
  filteredBranches,
  carouselRef
}: FeaturedCarouselStoresProps) => {
  return (
    <div>
   
      
      {/* Content Section */}
      <div className='w-full'>
        <h2 className="text-xl font-bold mb-4">Destacados</h2>
        
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
          // Carousel Display
          <Carousel
            className="flex flex-col touch-pan-y will-change-transform"
            opts={{ 
              loop: true, 
              align: "center",
              dragFree: true,
              containScroll: "trimSnaps"
            }}
            setApi={(api) => (carouselRef.current = api)}
          >
            <div className="relative w-full flex items-center lg:px-15">
              <CarouselContent className="cursor-grab active:cursor-grabbing">
                {filteredBranches.map((branch) => (
                  <CarouselItem 
                    key={branch.id} 
                    className="basis-4/5 sm:basis-1/2 lg:basis-1/3 pl-2 touch-pan-x"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="touch-pan-x px-1"
                      layout={false} 
                    >
                      <FeaturedCard branches={branch} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Controls */}
              <CarouselPrevious className="flex absolute left-0 top-1/3 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10" />
              <CarouselNext className="flex absolute right-0 top-1/3 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10" />
            </div>
          </Carousel>
        )}
      </div>
    </div>
  );
};