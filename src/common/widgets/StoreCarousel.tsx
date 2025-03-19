// src/common/widgets/StoreCarousel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Text } from '@/common/atoms/Text';
import { StoreCard } from '@/common/molecules/StoreCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/common/ui/carousel";
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import type { CarouselApi } from "@/common/ui/carousel";
import { Search, Coffee, MapPin, Star, Filter, ChevronRight } from 'lucide-react';

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

export const StoreCarousel = ({ stores }: StoreCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Para efectos de parallax al hacer scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.2, 1, 1, 0.2]);

  useEffect(() => {
    if (!api || !autoplay) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [api, autoplay]);

  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  const handleManualNavigation = () => {
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  const categories = ['Todos', 'Cercanos', 'Mejor valorados', 'Orgánicos', 'Artesanales'];

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 }}
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.15 }}
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-16"
          style={{ opacity }}
        >
          <motion.div className="flex items-center justify-center gap-3 mb-2" variants={titleVariants}>
            <div className="w-3 h-3 rounded-full bg-[#D4A76A]"></div>
            <Text variant="h2" className="text-center font-bold text-[#6F4E37] text-3xl md:text-4xl">Tiendas Aliadas</Text>
            <div className="w-3 h-3 rounded-full bg-[#D4A76A]"></div>
          </motion.div>
          
          <motion.div variants={titleVariants}>
            <div className="w-24 h-1 bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] mx-auto rounded-full mb-6"></div>
          </motion.div>
          
          <motion.div variants={titleVariants}>
            <Text variant="p" className="text-center text-[#2C1810]/80 max-w-xl mx-auto text-sm md:text-base">
              Descubre las mejores cafeterías artesanales con experiencias únicas y sabores excepcionales para los amantes del café
            </Text>
          </motion.div>
        </motion.div>
        
        {/* Barra de búsqueda y filtros */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Barra de búsqueda con animación */}
            <div className="relative w-full sm:w-64 md:w-80">
              <motion.div 
                className={`flex items-center bg-white rounded-full shadow-md transition-all duration-300 border ${
                  searchFocused ? 'border-[#6F4E37] ring-2 ring-[#6F4E37]/20' : 'border-transparent'
                }`}
                animate={{ width: searchFocused ? '100%' : '100%' }}
              >
                <Search className="w-4 h-4 ml-4 text-[#6F4E37]" />
                <input
                  type="text"
                  placeholder="Buscar cafeterías..."
                  className="py-2 px-3 w-full bg-transparent focus:outline-none text-sm placeholder-[#6F4E37]/50"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </motion.div>
            </div>
            
            {/* Filtros de categorías */}
            <div className="scrollbar-hide overflow-x-auto flex items-center space-x-2 py-1 w-full sm:w-auto">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-medium flex items-center gap-1 ${
                    selectedCategory === category
                      ? 'bg-[#6F4E37] text-white shadow-md'
                      : 'bg-white text-[#6F4E37] hover:bg-[#FAF3E0] shadow-sm'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'Todos' && <Coffee className="w-3 h-3" />}
                  {category === 'Cercanos' && <MapPin className="w-3 h-3" />}
                  {category === 'Mejor valorados' && <Star className="w-3 h-3" />}
                  {category === 'Orgánicos' && <Coffee className="w-3 h-3" />}
                  {category === 'Artesanales' && <Filter className="w-3 h-3" />}
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Carrusel mejorado */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {stores.map((store, index) => (
              <CarouselItem 
                key={store.id} 
                className="pl-4 basis-full xs:basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-2"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
          
          {/* Controles de navegación mejorados */}
          <div className="flex flex-col items-center justify-center mt-10 gap-6">
            <div className="flex items-center justify-center">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CarouselPrevious 
                  onClick={handleManualNavigation}
                  className="relative left-0 right-0 h-10 w-10 bg-white border-2 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A] hover:text-white transition-all duration-300 opacity-90 hover:opacity-100 shadow-md mr-2"
                />
              </motion.div>
              
              <div className="flex space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                {Array.from({ length: count > 5 ? 5 : count }).map((_, i) => (
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
                      handleManualNavigation();
                    }}
                    aria-label={`Ir a la tienda ${i + 1}`}
                  />
                ))}
              </div>
              
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CarouselNext 
                  onClick={handleManualNavigation}
                  className="relative left-0 right-0 h-10 w-10 bg-white border-2 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A] hover:text-white transition-all duration-300 opacity-90 hover:opacity-100 shadow-md ml-2"
                />
              </motion.div>
            </div>
            
            {/* Botón "Ver todas" */}
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: "0 8px 20px -5px rgba(111, 78, 55, 0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-gradient-to-r from-[#6F4E37] to-[#A67C52] rounded-full text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all group flex items-center"
            >
              <span>Ver todas las tiendas</span>
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </div>
        </Carousel>
      </div>
    </section>
  );
};