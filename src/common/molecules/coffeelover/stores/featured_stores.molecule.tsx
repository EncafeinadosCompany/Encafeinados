import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
import AutoPlay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/common/ui/carousel";
import FeaturedCard from "@/common/molecules/coffeelover/stores/featured_card.molecule";
import { useEffect, useState, useRef, useCallback } from "react";

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
  const [current, setCurrent] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 1024);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwipeActive(true);
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;
      setTouchEnd(e.targetTouches[0].clientX);

      // Removemos el preventDefault para evitar el error de passive event listener
      // El carrusel manejará el scroll automáticamente
    },
    [touchStart]
  );
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !api) {
      setIsSwipeActive(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && api.canScrollNext()) {
      api.scrollNext();
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } else if (isRightSwipe && api.canScrollPrev()) {
      api.scrollPrev();
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwipeActive(false);
  }, [touchStart, touchEnd, api, minSwipeDistance]);

  useEffect(() => {
    if (!api) return;
    const snapList = api.scrollSnapList();
    setCount(snapList.length);
    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrent(selectedIndex + 1);
    };
    onSelect();
        api.on("select", onSelect);
    setIsInitialized(true);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="w-full relative mb-2  md:px-0">
        {filteredBranches.length === 0 ? (
          <div className="w-full py-8 text-center border-none">
            <p className="text-gray-500">
              No se encontraron tiendas con los términos "{searchTerm}"
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSearchTerm("");
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
            <div className="flex p-2 justify-self-start mb-2">
               <h2 className="text-lg font-bold">Cafés Destacados</h2>
            </div>
            <Carousel
              ref={carouselRef}
              setApi={setApi}
              opts={{
                align: isDesktop ? "start" : "center", 
                loop: false,
                dragFree: false,
                containScroll: "trimSnaps",
                slidesToScroll: 1,
                breakpoints: {
                  "(max-width: 768px)": {
                    dragFree: true,
                    containScroll: false,
                    align: "center",
                  },
                },
              }}
              className={`w-full max-w-7xl h-full py-2 touch-pan-x select-none ${
                isSwipeActive ? "cursor-grabbing" : "cursor-grab"
              }`}
              plugins={[AutoPlay({ delay: 5000 })]}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <CarouselContent className="flex w-full h-full -ml-2 md:-ml-4">
                {branches.map((branch, index) => (
                  <CarouselItem
                    key={branch.id}
                    className="cursor-pointer basis-[98%] sm:basis-[80%] md:basis-1/2 lg:basis-1/3 flex justify-center pl-2 md:pl-4"
                  >
                    <FeaturedCard
                      branches={branch}
                      current={current}
                      isFeatured={
                        isDesktop
                          ? index === (api?.selectedScrollSnap() ?? -1) + 1 
                          : index === current - 1 
                      }
                      index={index}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute top-32 right-12 -translate-x-1/2 z-10 hidden md:block">
                <CarouselNext className="bg-black/10 backdrop-blur-sm" />
              </div>

              <div className="absolute top-32 left-12 -translate-x-1/2 z-10 hidden md:block">
                <CarouselPrevious className="bg-black/10 backdrop-blur-sm" />
              </div>
            </Carousel>
          </div>
        )}
        
        {count > 0 && isInitialized && (
          <div className="flex flex-col items-center w-full space-y-2">
            <div className="md:hidden flex justify-center space-x-2">
              {Array.from({ length: count }, (_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    current === index + 1
                      ? "bg-amber-600 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a la tienda ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
