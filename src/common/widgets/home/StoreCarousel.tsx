import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text } from "@/common/atoms/Text";
import { StoreCard } from "@/common/molecules/home/StoreCard";
import { StoreCardSkeleton } from "@/common/molecules/home/StoreCardSkeleton";
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/common/ui/carousel";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import type { CarouselApi } from "@/common/ui/carousel";
import { Coffee, ChevronRight} from "@/common/ui/icons";
import { useGeolocation } from "@/common/hooks/map/useGeolocation";
import { calculateDistance } from "@/common/utils/map/mapUtils";
import L from 'leaflet';
import { useBranches } from "@/api/queries/stores/branchesQueries";
import { useStores } from "@/api/queries/stores/storesQueries";

interface StoreCardProps {
  id: number;
  name: string;
  imageUrl: string;
  distance?: string;
  email: string;
  phone: string;
  description?: string;
}
const AUTOPLAY_DELAY = 4000;
const INTERACTION_PAUSE = 5000;

const animations = {
  title: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  },
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.12,
        ease: "easeOut",
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
};

const GENERIC_DESCRIPTIONS = [
  "Café de especialidad con granos seleccionados de las mejores regiones productoras.",
  "Experiencia única con métodos de preparación artesanales y ambiente acogedor.",
  "Del grano a la taza, cuidamos cada detalle para ofrecerte el mejor sabor.",
  "Sabores auténticos de Colombia, con un compromiso por la calidad y sostenibilidad."
];

const MemoizedStoreCard = React.memo(StoreCard);

interface CarouselControlsProps {
  api: CarouselApi | undefined;
  current: number;
  count: number;
  handleUserInteraction: () => void;
}

const CarouselControls = React.memo(({ api, current, count, handleUserInteraction }: CarouselControlsProps) => (
  <div className="flex flex-col items-center justify-center mt-8 gap-5">
    <div className="flex items-center justify-center">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <CarouselPrevious
          onClick={() => {
            api?.scrollPrev();
            handleUserInteraction();
          }}
          className="relative h-10 w-10 bg-white border-2 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A] hover:text-white transition-all duration-300 shadow-md mr-2"
        />
      </motion.div>

      <div className="flex space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
        {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
          <motion.button
            key={i}
            className={`transition-all duration-300 rounded-full ${
              i === current % 5
                ? "bg-[#6F4E37] w-6 h-2"
                : "bg-[#D4A76A]/40 hover:bg-[#D4A76A]/60 w-2 h-2"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              api?.scrollTo(i);
              handleUserInteraction();
            }}
            aria-label={`Ir a la tienda ${i + 1}`}
          />
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <CarouselNext
          onClick={() => {
            api?.scrollNext();
            handleUserInteraction();
          }}
          className="relative h-10 w-10 bg-white border-2 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A] hover:text-white transition-all duration-300 shadow-md ml-2"
        />
      </motion.div>
    </div>
    
    {/* <motion.button
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 20px -5px rgba(111, 78, 55, 0.3)",
      }}
      whileTap={{ scale: 0.97 }}
      className="px-8 py-3 bg-gradient-to-r from-[#6F4E37] to-[#A67C52] rounded-full text-white font-medium text-sm shadow-lg transition-all flex items-center"
      onClick={handleUserInteraction}
    >
      <span>Ver todas las tiendas</span>
      <motion.span
        className="inline-block ml-2"
        animate={{
          x: [0, 4, 0],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          },
        }}
      >
        <ChevronRight className="w-4 h-4" />
      </motion.span>
    </motion.button> */}
  </div>
));

export const StoreCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [mapInstanceDummy, setMapInstanceDummy] = useState<L.Map | null>(null);

  const { data: storesData, isLoading, error } = useStores();
  const { data: branchesData, isLoading: branchesLoading } = useBranches();

  const { userLocation } = useGeolocation(mapInstanceDummy);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3]
  );

  const stores: StoreCardProps[] = React.useMemo(() => {
    if (!storesData?.stores?.stores) {
      return [];
    }

    return storesData.stores.stores.map((store) => {
      const storeBranches = branchesData?.branches?.branches?.filter(
        branch => branch.store_name === store.name
      ) || [];

      let nearestDistance = "No disponible";
      let nearestBranchName = "";
      
      if (userLocation && storeBranches.length > 0) {
        let minDistance = Number.MAX_VALUE;
        let closestBranch = null;
        
        storeBranches.forEach(branch => {
          if (branch.latitude && branch.longitude) {
            const distKm = calculateDistance(
              userLocation[0],
              userLocation[1],
              branch.latitude,
              branch.longitude
            );

            const distValue = parseFloat(distKm);
            if (distValue < minDistance) {
              minDistance = distValue;
              closestBranch = branch;
            }
          }
        });

        if (closestBranch) {
          nearestDistance = `${minDistance.toFixed(1)} km`;
        }
      } else if (!userLocation) {
        nearestDistance = "Ubicación no disponible";
      } else if (storeBranches.length === 0) {
        nearestDistance = "Sin sucursales cercanas";
      }

      return {
        id: store.id,
        name: store.name,
        imageUrl: store.logo || "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg",
        distance: nearestDistance,
        nearestBranch: nearestBranchName,
        email: store.email,
        phone: store.phone_number,
        description: GENERIC_DESCRIPTIONS[Math.floor(Math.random() * GENERIC_DESCRIPTIONS.length)]
      };
    });
  }, [storesData, userLocation, branchesData]);

  const filteredStores = React.useMemo(() => {
    if (!stores.length) return [];

    let result = stores;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(store =>
        store.name.toLowerCase().includes(term) ||
        store.description?.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory !== "Todos") {
      if (selectedCategory === "Cercanos") {
        result = [...result].sort((a, b) => {
          const distA = a.distance ? parseFloat(a.distance.split(' ')[0]) : 9999;
          const distB = b.distance ? parseFloat(b.distance.split(' ')[0]) : 9999;
          return distA - distB;
        });
      }

    }

    return result;
  }, [stores, searchTerm, selectedCategory]);

  const [carouselState, setCarouselState] = useState({
    current: 0,
    count: 0,
    autoplay: true,
    lastInteraction: 0
  });
  interface CarouselState {
    current: number;
    count: number;
    autoplay: boolean;
    lastInteraction: number;
  }

  type CarouselStateUpdates = Partial<CarouselState>;

  const updateCarouselState = useCallback((updates: CarouselStateUpdates) => {
    setCarouselState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleUserInteraction = useCallback(() => {
    updateCarouselState({
      autoplay: false,
      lastInteraction: Date.now()
    });
  }, [updateCarouselState]);

  useEffect(() => {
    if (!api) return;

    const advanceCarousel = () => {
      const totalItems = api.scrollSnapList().length;
      const currentIndex = api.selectedScrollSnap();  
      if (currentIndex >= totalItems - 1 && totalItems > 1) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    };

    const interval = setInterval(() => {
      const now = Date.now();

      if (!carouselState.autoplay && now - carouselState.lastInteraction > INTERACTION_PAUSE) {
        updateCarouselState({ autoplay: true });
      }
      if (carouselState.autoplay) {
        advanceCarousel();
      }
    }, AUTOPLAY_DELAY);

    return () => clearInterval(interval);
  }, [api, carouselState.autoplay, carouselState.lastInteraction, updateCarouselState]);

  useEffect(() => {
    if (!api) return;

    const updateState = () => {
      updateCarouselState({
        count: api.scrollSnapList().length,
        current: api.selectedScrollSnap()
      });
    };

    updateState();
    api.on("select", updateState);
    api.on("pointerDown", handleUserInteraction);
    return () => {
      api.off("select", updateState);
      api.off("pointerDown", handleUserInteraction);
    };
  }, [api, handleUserInteraction, updateCarouselState]);


  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden bg-[#FAF3E0]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={animations.container}
          className="mb-12"
          style={{ opacity }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-2"
            variants={animations.title}
          >
            <div className="w-3 h-3 rounded-full bg-[#D4A76A]"></div>
            <Text
              variant="h2"
              className="text-center font-bold text-[#6F4E37] text-3xl md:text-4xl"
            >
              Tiendas Aliadas
            </Text>
            <div className="w-3 h-3 rounded-full bg-[#D4A76A]"></div>
          </motion.div>

          <motion.div variants={animations.title}>
            <div className="w-24 h-1 bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] mx-auto rounded-full mb-6"></div>
          </motion.div>

          <motion.div variants={animations.title}>
            <Text
              variant="p"
              className="text-center text-[#2C1810]/80 max-w-xl mx-auto text-sm md:text-base"
            >
              Descubre las mejores cafeterías artesanales con experiencias
              únicas y sabores excepcionales para los amantes del café
            </Text>
          </motion.div>
        </motion.div>


        {/* Estado de carga con skeletons mejorados */}
        {isLoading && (
          <div className="relative" data-testid="store-carousel-loading">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4 pt-1 pb-0.5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem
                    key={`skeleton-${index}`}
                    className="pl-2 md:pl-4 basis-full xs:basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <StoreCardSkeleton />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex flex-col items-center justify-center mt-8 gap-5">
                <div className="flex items-center justify-center">
                  <div className="relative h-10 w-10 rounded-full bg-gray-200 animate-pulse mr-2" />
                  <div className="flex space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-full bg-gray-200 animate-pulse ${
                          i === 0 ? "w-6 h-2" : "w-2 h-2"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="relative h-10 w-10 rounded-full bg-gray-200 animate-pulse ml-2" />
                </div>
                <div className="w-48 h-10 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </Carousel>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-red-600">
            <p className="font-medium">Error al cargar las tiendas</p>
            <p className="text-sm mt-2">Por favor, intenta nuevamente más tarde</p>
          </div>
        )}
        {!isLoading && !error && filteredStores.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Coffee className="h-12 w-12 text-[#6F4E37] mb-4" />
            <p className="text-[#6F4E37] font-medium">No se encontraron tiendas</p>
            {searchTerm && (
              <button
                className="mt-4 text-sm text-[#6F4E37] underline"
                onClick={() => setSearchTerm("")}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
        {!isLoading && !error && filteredStores.length > 0 && (
          <div className="relative">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,    
                dragFree: true,
                skipSnaps: false,
                containScroll: "trimSnaps", 
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4 pt-1 pb-0.5">
                {filteredStores.map((store, index) => (
                  <CarouselItem
                    key={store.id}
                    className="pl-2 md:pl-4 basis-full xs:basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <motion.div
                      custom={index}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      variants={animations.item}
                      transition={{
                        delay: Math.min(index * 0.05, 0.3),
                        duration: 0.4,
                      }}
                    >
                      <MemoizedStoreCard
                        id={store.id}
                        name={store.name}
                        imageUrl={store.imageUrl}
                        distance={store.distance}
                        email={store.email}
                        phone={store.phone}
                        description={store.description}
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselControls
                api={api}
                current={carouselState.current}
                count={carouselState.count}
                handleUserInteraction={handleUserInteraction}
              />
            </Carousel>
          </div>
        )}
      </div>
      <motion.div
        className="absolute top-20 right-2 w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#D4A76A]/10 -z-10"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 left-2 w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#6F4E37]/10 -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </section>
  );
};
