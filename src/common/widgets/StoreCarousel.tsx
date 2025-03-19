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
import { motion } from 'framer-motion';
import type { CarouselApi } from "@/common/ui/carousel";
import { useInView } from 'framer-motion';

interface Store {
  id: number;
  name: string;
  imageUrl: string;
  rating?: number;
  distance?: string;
  openTime?: string;
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
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!api || !autoplay) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [api, autoplay]);

  // Obtener información sobre el estado actual del carrusel
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

    setTimeout(() => setAutoplay(true), 5000);
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 }}
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.1 }}
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 bg-gradient-to-b from-[#FAF3E0] to-white relative overflow-hidden"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#D4A76A] opacity-10"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-[#6F4E37] opacity-5"></div>
        <div className="absolute -bottom-20 left-1/3 w-40 h-40 rounded-full bg-[#A67C52] opacity-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-12"
        >
          <motion.div variants={titleVariants}>
            <Text variant="h2" className="text-center font-bold text-[#6F4E37] mb-2">Tiendas Aliadas</Text>
          </motion.div>
          <motion.div variants={titleVariants} className="w-24 h-1 bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] mx-auto rounded-full mb-4"></motion.div>
          <motion.div variants={titleVariants}>
            <Text variant="p" className="text-center text-[#2C1810] max-w-2xl mx-auto">
              Descubre las mejores cafeterías de la ciudad con experiencias únicas y sabores excepcionales
            </Text>
          </motion.div>
        </motion.div>
        
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {stores.map((store) => (
              <CarouselItem 
                key={store.id} 
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-2"
              >
                <StoreCard 
                  name={store.name} 
                  imageUrl={store.imageUrl}
                  rating={store.rating}
                  distance={store.distance}
                  openTime={store.openTime}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex items-center justify-center mt-8 gap-2">
            <CarouselPrevious 
              onClick={handleManualNavigation}
              className="relative bg-white border border-[#D4A76A] hover:bg-[#D4A76A] hover:text-white transition-colors mr-2"
            />
            
            <div className="flex space-x-1">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === current ? "bg-[#6F4E37] w-6" : "bg-[#D4A76A]"
                  }`}
                  onClick={() => {
                    api?.scrollTo(i);
                    handleManualNavigation();
                  }}
                  aria-label={`Ir a la tienda ${i + 1}`}
                />
              ))}
            </div>
            
            <CarouselNext 
              onClick={handleManualNavigation}
              className="relative bg-white border border-[#D4A76A] hover:bg-[#D4A76A] hover:text-white transition-colors ml-2"
            />
          </div>
        </Carousel>
        
        <div className="mt-10 text-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-[#6F4E37] to-[#A67C52] rounded-full text-white font-medium shadow-md hover:shadow-lg transition-all"
          >
            Ver todas las tiendas
          </motion.button>
        </div>
      </div>
    </section>
  );
};