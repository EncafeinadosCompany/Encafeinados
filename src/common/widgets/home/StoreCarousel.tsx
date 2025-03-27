import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text } from "@/common/atoms/Text";
import { StoreCard } from "@/common/molecules/home/StoreCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/common/ui/carousel";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import type { CarouselApi } from "@/common/ui/carousel";
import {
  Search,
  Coffee,
  MapPin,
  Star,
  Filter,
  ChevronRight,
} from "lucide-react";

interface Store {
  id: number;
  name: string;
  imageUrl: string;
  rating?: number;
  distance?: string;
  openTime?: string;
  description?: string;
  specialties?: string[];
}

interface StoreCarouselProps {
  stores: Store[];
}

// Constantes para mejorar la legibilidad y mantenimiento
const AUTOPLAY_DELAY = 4000;
const INTERACTION_PAUSE = 5000;
const CATEGORIES = [
  { name: "Todos", icon: Coffee },
  { name: "Cercanos", icon: MapPin },
  { name: "Mejor valorados", icon: Star },
  { name: "Orgánicos", icon: Coffee },
  { name: "Artesanales", icon: Filter },
];

// Variantes de animación extraídas para mejor organización
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

export const StoreCarousel = ({ stores }: StoreCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Efecto de parallax optimizado
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3]
  );

  // Manejar la interacción del usuario
  const handleUserInteraction = useCallback(() => {
    setLastInteraction(Date.now());
    setAutoplay(false);
  }, []);

  // Mejorado: Autoplay con pausa por interacción
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      const now = Date.now();
      // Reanuda el autoplay después del tiempo de pausa por interacción
      if (!autoplay && now - lastInteraction > INTERACTION_PAUSE) {
        setAutoplay(true);
      }

      // Avanza el carrusel solo si el autoplay está activo
      if (autoplay) {
        api.scrollNext();
      }
    }, AUTOPLAY_DELAY);

    return () => clearInterval(interval);
  }, [api, autoplay, lastInteraction]);

  // Sincronizar estado con el API del carrusel
  useEffect(() => {
    if (!api) return;

    const updateState = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    updateState();
    api.on("select", updateState);

    // Detectar interacción del usuario con el carrusel
    api.on("pointerDown", handleUserInteraction);

    return () => {
      api.off("select", updateState);
      api.off("pointerDown", handleUserInteraction);
    };
  }, [api, handleUserInteraction]);

  // Seleccionar categoría con interrupción de autoplay
  const handleCategorySelect = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      handleUserInteraction();
    },
    [handleUserInteraction]
  );

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

        {/* Barra de búsqueda optimizada */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Barra de búsqueda con animación */}
            <div className="relative w-full sm:w-64 md:w-80">
              <motion.div
                className={`flex items-center bg-white rounded-full shadow-md transition-all duration-300 border ${
                  searchFocused
                    ? "border-[#6F4E37] ring-2 ring-[#6F4E37]/20"
                    : "border-transparent"
                }`}
                animate={{
                  boxShadow: searchFocused
                    ? "0 4px 12px rgba(166, 124, 82, 0.15)"
                    : "0 2px 6px rgba(166, 124, 82, 0.1)",
                }}
              >
                <Search className="w-4 h-4 ml-4 text-[#6F4E37]" />
                <input
                  type="text"
                  placeholder="Buscar cafeterías..."
                  className="py-2 px-3 w-full bg-transparent focus:outline-none text-sm placeholder-[#6F4E37]/50"
                  onFocus={() => {
                    setSearchFocused(true);
                    handleUserInteraction();
                  }}
                  onBlur={() => setSearchFocused(false)}
                />
              </motion.div>
            </div>

            {/* Filtros de categorías optimizados */}
            <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
              <div className="flex items-center space-x-2 py-1 min-w-max">
                {CATEGORIES.map(({ name, icon: Icon }) => (
                  <motion.button
                    key={name}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-medium flex items-center gap-1 ${
                      selectedCategory === name
                        ? "bg-[#6F4E37] text-white shadow-md"
                        : "bg-white text-[#6F4E37] hover:bg-[#FAF3E0] shadow-sm"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategorySelect(name)}
                  >
                    <Icon className="w-3 h-3" />
                    {name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Carrusel optimizado */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4 pt-1 pb-0.5">
              {stores.map((store, index) => (
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
                      delay: Math.min(index * 0.05, 0.3), // Limitar el delay máximo
                      duration: 0.4,
                    }}
                  >
                    <StoreCard
                      name={store.name}
                      imageUrl={store.imageUrl}
                      rating={store.rating}
                      distance={store.distance}
                      openTime={store.openTime}
                      description={store.description}
                      specialties={store.specialties}
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controles de navegación optimizados */}
            <div className="flex flex-col items-center justify-center mt-8 gap-5">
              <div className="flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CarouselPrevious
                    onClick={() => {
                      api?.scrollPrev();
                      handleUserInteraction(); // Pausar autoplay al interactuar manualmente
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

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CarouselNext
                    onClick={() => {
                      api?.scrollNext();
                      handleUserInteraction();
                    }}
                    className="relative h-10 w-10 bg-white border-2 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A] hover:text-white transition-all duration-300 shadow-md ml-2"
                  />
                </motion.div>
              </div>

              {/* Botón "Ver todas" optimizado */}
              <motion.button
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
              </motion.button>
            </div>
          </Carousel>
        </div>
      </div>

      {/* Elementos decorativos simplificados */}
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
