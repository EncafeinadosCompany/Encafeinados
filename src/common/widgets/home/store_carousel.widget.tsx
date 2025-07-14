import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text } from "@/common/atoms/common/text.atom";
import { BranchCard } from "@/common/molecules/home/branch_card.molecule";
import { StoreCardSkeleton } from "@/common/molecules/home/store_card_skeleton.molecule";
import {Carousel,CarouselContent,CarouselItem} from "@/common/ui/carousel";
import { motion, useInView } from "framer-motion"; 
import type { CarouselApi } from "@/common/ui/carousel";
import { Coffee } from "@/common/ui/icons";
import { useSearchBranches, BranchSearchParams, useBranchAttributes, useBranchesID } from "@/api/queries/branches/branch.query";

interface BranchCardProps {
  id: number;
  name: string;
  imageUrl: string;
  address: string;
  phone?: string;
  description?: string;
  rating?: string;
  isOpen?: boolean;
  attributes?: Array<{ attributeName: string; value: string }>;
  distance?: number;
}
const AUTOPLAY_DELAY = 4000;
const INTERACTION_PAUSE = 5000;

const animations = {
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
};

// Función para obtener la ubicación del usuario
const getUserLocation = (): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        // Si falla la geolocalización, usar coordenadas de Medellín por defecto
        resolve({
          lat: 6.2442,
          lng: -75.5812
        });
      },
      { timeout: 5000 }
    );
  });
};

// Función auxiliar para calcular distancia usando la fórmula de Haversine
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const MemoizedBranchCard = React.memo(BranchCard);

interface CarouselControlsProps {
  api: CarouselApi | undefined;
  current: number;
  count: number;
  handleUserInteraction: () => void;
}

// Simplificado con menos motion components
const CarouselControls = React.memo(({ api, current, count, handleUserInteraction }: CarouselControlsProps) => {
  // No mostrar controles si hay 4 o menos elementos (ya que se pueden ver todos a la vez en desktop)
  if (count <= 4) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-8 gap-5">
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            api?.scrollPrev();
            handleUserInteraction();
          }}
          className="relative h-10 w-10 bg-white border-2 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A] hover:text-white transition-all duration-300 shadow-md mr-2 rounded-full flex items-center justify-center transform hover:scale-105 active:scale-95"
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="flex space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
          {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
            <button
              key={i}
              className={`transition-all duration-300 rounded-full transform hover:scale-120 active:scale-90 ${
                i === current % 5
                  ? "bg-[#6F4E37] w-6 h-2"
                  : "bg-[#D4A76A]/40 hover:bg-[#D4A76A]/60 w-2 h-2"
              }`}
              onClick={() => {
                api?.scrollTo(i);
                handleUserInteraction();
              }}
              aria-label={`Ir a la sucursal ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            api?.scrollNext();
            handleUserInteraction();
          }}
          className="relative h-10 w-10 bg-white border-2 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A] hover:text-white transition-all duration-300 shadow-md ml-2 rounded-full flex items-center justify-center transform hover:scale-105 active:scale-95"
          aria-label="Siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
});

export const StoreCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Obtener ubicación del usuario al cargar el componente
  useEffect(() => {
    getUserLocation().then(setUserLocation);
  }, []);

  // Configurar parámetros de búsqueda para sucursales aprobadas
  const searchParams: BranchSearchParams = {
    sortBy: 'distance',
    ...(userLocation && {
      lat: userLocation.lat,
      lng: userLocation.lng
    })
  };

  const { data: branchesData, isLoading, error } = useSearchBranches(searchParams);

  // Procesamiento de datos de sucursales aprobadas
  const branches: BranchCardProps[] = React.useMemo(() => {
    if (!branchesData?.branches) {
      return [];
    }

    // Limitar a 10 sucursales máximo, ya vienen ordenadas por distancia
    const limitedBranches = branchesData.branches.slice(0, 10);

    return limitedBranches.map((branch) => {
      return {
        id: branch.id,
        name: branch.name,
        imageUrl: branch.store_logo || "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg",
        address: branch.address,
        // La descripción se generará dinámicamente basada en atributos
        description: undefined,
        rating: branch.average_rating,
        isOpen: branch.isOpen,
        attributes: [], // Los atributos se cargarán dinámicamente desde la API al hacer hover
        distance: userLocation ? calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          branch.latitude, 
          branch.longitude
        ) : undefined
      };
    });
  }, [branchesData, userLocation]); 

  const filteredBranches = React.useMemo(() => {
    if (!branches.length) return [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return branches.filter(branch =>
        branch.name.toLowerCase().includes(term) ||
        branch.description?.toLowerCase().includes(term) ||
        branch.address.toLowerCase().includes(term)
      );
    }

    return branches;
  }, [branches, searchTerm]);

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

  // Autoplay optimizado con menos comprobaciones
  useEffect(() => {
    if (!api) return;

    const advanceCarousel = () => {
      const totalItems = api.scrollSnapList().length;
      if (totalItems <= 1) return;
      
      const currentIndex = api.selectedScrollSnap();  
      if (currentIndex >= totalItems - 1) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    };

    const interval = setInterval(() => {
      const now = Date.now();

      // Restaurar autoplay después del tiempo de pausa
      if (!carouselState.autoplay && now - carouselState.lastInteraction > INTERACTION_PAUSE) {
        updateCarouselState({ autoplay: true });
      }
      
      // Solo avanzar si autoplay está activo
      if (carouselState.autoplay) {
        advanceCarousel();
      }
    }, AUTOPLAY_DELAY);

    return () => clearInterval(interval);
  }, [api, carouselState.autoplay, carouselState.lastInteraction, updateCarouselState]);

  // Actualización del estado del carrusel
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
      {/* Círculos decorativos usando CSS en lugar de Framer Motion */}
      <div className="absolute top-20 right-2 w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#D4A76A]/10 -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-2 w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#6F4E37]/10 -z-10 animate-pulse-slow-alt"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado con CSS en lugar de Framer Motion */}
        <div className={`mb-12 transition-opacity duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#D4A76A]"></div>
            <Text
              variant="h2"
              className="text-center font-bold text-[#6F4E37] text-3xl md:text-4xl"
            >
              Sucursales Destacadas
            </Text>
            <div className="w-3 h-3 rounded-full bg-[#D4A76A]"></div>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] mx-auto rounded-full mb-6"></div>

          <Text
            variant="p"
            className="text-center text-[#2C1810]/80 max-w-xl mx-auto text-sm md:text-base"
          >
            Explora las mejores sucursales de café cerca de ti, ordenadas por distancia 
            y con todas sus características especiales
          </Text>
        </div>

        {/* Estado de carga con skeletons - optimizado */}
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
                    <div className="animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                      <StoreCardSkeleton />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Solo mostrar controles de skeleton si se espera que haya más de 4 elementos */}
              <div className="flex flex-col items-center justify-center mt-8 gap-5">
                <div className="flex items-center justify-center">
                  <div className="relative h-10 w-10 rounded-full bg-gray-200 animate-pulse mr-2" />
                  <div className="flex space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                    {Array.from({ length: 3 }).map((_, i) => (
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
              </div>
            </Carousel>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-red-600">
            <p className="font-medium">Error al cargar las sucursales</p>
            <p className="text-sm mt-2">Por favor, intenta nuevamente más tarde</p>
          </div>
        )}

        {/* Sin resultados */}
        {!isLoading && !error && filteredBranches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Coffee className="h-12 w-12 text-[#6F4E37] mb-4" />
            <p className="text-[#6F4E37] font-medium">No se encontraron cafeterías</p>
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

        {/* Carrusel de sucursales */}
        {!isLoading && !error && filteredBranches.length > 0 && (
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
                {filteredBranches.map((branch: BranchCardProps, index: number) => (
                  <CarouselItem
                    key={branch.id}
                    className="pl-2 md:pl-4 basis-full xs:basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    {/* Usar motion solo para la entrada - esto mejora el rendimiento pero mantiene la estética */}
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
                      <MemoizedBranchCard
                        id={branch.id}
                        name={branch.name}
                        imageUrl={branch.imageUrl}
                        address={branch.address}
                        phone={branch.phone}
                        description={branch.description}
                        rating={branch.rating}
                        isOpen={branch.isOpen}
                        attributes={branch.attributes}
                        distance={branch.distance}
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Controles optimizados */}
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
    </section>
  );
};
