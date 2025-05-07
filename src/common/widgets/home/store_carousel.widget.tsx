import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text } from "@/common/atoms/Text";
import { StoreCard } from "@/common/molecules/home/store_card.molecule";
import { StoreCardSkeleton } from "@/common/molecules/home/store_card_skeleton.molecule";
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/common/ui/carousel";
import { motion, useInView } from "framer-motion"; 
import type { CarouselApi } from "@/common/ui/carousel";
import { Coffee } from "@/common/ui/icons";
import { useStores } from "@/api/queries/stores/stores.query";

interface StoreCardProps {
  id: number;
  name: string;
  imageUrl: string;
  email: string;
  phone: string;
  description?: string;
}
const AUTOPLAY_DELAY = 4000;
const INTERACTION_PAUSE = 5000;

// Simplificado a solo las animaciones que realmente necesitan Framer Motion
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

// Simplificado con menos motion components
const CarouselControls = React.memo(({ api, current, count, handleUserInteraction }: CarouselControlsProps) => (
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
            aria-label={`Ir a la tienda ${i + 1}`}
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
));

export const StoreCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: storesData, isLoading, error } = useStores();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Procesamiento de datos de tiendas
  const stores: StoreCardProps[] = React.useMemo(() => {
    if (!storesData?.stores?.stores) {
      return [];
    }

    return storesData.stores.stores.map((store) => {
      return {
        id: store.id,
        name: store.name,
        imageUrl: store.logo || "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg",
        email: store.email,
        phone: store.phone_number,
        description: GENERIC_DESCRIPTIONS[Math.floor(Math.random() * GENERIC_DESCRIPTIONS.length)]
      };
    });
  }, [storesData]); 

  // Filtrado solo por búsqueda (eliminada la funcionalidad de categorías)
  const filteredStores = React.useMemo(() => {
    if (!stores.length) return [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return stores.filter(store =>
        store.name.toLowerCase().includes(term) ||
        store.description?.toLowerCase().includes(term)
      );
    }

    return stores;
  }, [stores, searchTerm]);

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
              Cafeterías Aliadas
            </Text>
            <div className="w-3 h-3 rounded-full bg-[#D4A76A]"></div>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] mx-auto rounded-full mb-6"></div>

          <Text
            variant="p"
            className="text-center text-[#2C1810]/80 max-w-xl mx-auto text-sm md:text-base"
          >
            Descubre las mejores cafeterías artesanales con experiencias
            únicas y sabores excepcionales para los amantes del café
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
              </div>
            </Carousel>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-red-600">
            <p className="font-medium">Error al cargar las tiendas</p>
            <p className="text-sm mt-2">Por favor, intenta nuevamente más tarde</p>
          </div>
        )}

        {/* Sin resultados */}
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

        {/* Carrusel de tiendas */}
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
                      <MemoizedStoreCard
                        id={store.id}
                        name={store.name}
                        imageUrl={store.imageUrl}
                        email={store.email}
                        phone={store.phone}
                        description={store.description}
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
