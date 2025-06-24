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
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState<boolean>(false);
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

      const distance = Math.abs(touchStart - e.targetTouches[0].clientX);
      if (distance > 10) {
        e.preventDefault();
      }
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

    setCount(api.scrollSnapList().length);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    api.on("pointerDown", () => {
      console.log("👆 Carousel touched");
    });

    api.on("scroll", () => {
      console.log("📦 Carousel scrolling");
    });
  }, [api]);

  console.log("Branches:", count, current);
  return (
    <>
      <div className="w-full relative ">
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
            {" "}
            <div className="flex justify-between mb-2">
              <h2 className="text-3xl font-light text-gray-700">
                Cafés Destacados
              </h2>
             
            </div>{" "}
            <Carousel
              ref={carouselRef}
              setApi={setApi}
              opts={{
                align: "start",
                loop: false,
                dragFree: false,
                containScroll: "trimSnaps",
                slidesToScroll: 1,
                breakpoints: {
                  "(max-width: 768px)": {
                    dragFree: true,
                    containScroll: false,
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
              <CarouselContent className="flex w-full h-full">
                {branches.map((branch, index) => (
                  <CarouselItem
                    key={branch.id}
                    className="basis-full md:basis-1/2 lg:basis-1/3 flex justify-center"
                  >
                    <FeaturedCard
                      branches={branch}
                      current={current}
                      isFeatured={index === 1}
                      index={index}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute top-32 right-12 -translate-x-1/2 z-10 hidden md:block">
                <CarouselNext className="bg-black/10  backdrop-blur-sm" />
              </div>

              <div className="absolute top-32 left-12 -translate-x-1/2 z-10 hidden md:block">
                <CarouselPrevious className="bg-black/10 backdrop-blur-sm" />
              </div>
            </Carousel>
          </div>
        )}{" "}
        {count > 0 && (
          <div className="flex flex-col items-center w-full mt-4 space-y-2">
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

            <span className="text-xs text-gray-400">
              Mostrando <span className="font-semibold">{current}</span> de{" "}
              <span className="font-semibold">{count}</span> tiendas destacadas
            </span>
          </div>
        )}
      </div>
    </>
  );
};
