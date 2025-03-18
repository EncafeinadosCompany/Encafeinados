import React, { useEffect, useState } from 'react';
import { Text } from '@/common/atoms/Text';
import { MapComponent } from '@/common/atoms/MapComponent';
import { motion, AnimatePresence } from 'framer-motion';
import { LatLngExpression } from 'leaflet';

export const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detectar si es dispositivo móvil para ajustes de diseño
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const medellinPosition: LatLngExpression = [6.2476, -75.5658];

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Overlay de gradiente para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-10" />
      
      {/* Componente de mapa */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <MapComponent 
              position={medellinPosition} 
              popupText="Encafeinados - Tu destino cafetero"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contenido principal */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: [0.645, 0.045, 0.355, 1.000] // Cubic bezier para una animación más suave
          }}
          className="text-center max-w-4xl"
        >
          {/* Contenedor de texto con fondo semitransparente */}
          <div className="backdrop-blur-sm bg-black/40 p-6 md:p-8 rounded-xl shadow-xl border border-white/10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-2"
            >
              <Text variant="h1" className="text-white font-extrabold tracking-tight mb-4 drop-shadow-lg">
                Bienvenido a <span className="text-[#D4A76A]">Encafeinados</span>
              </Text>
              
              <div className="w-16 h-1 bg-[#D4A76A] mx-auto mb-4 rounded-full" />
              
              <Text variant="p" className="text-white/90 max-w-xl mx-auto font-light drop-shadow-md leading-relaxed">
                Descubre las mejores cafeterías de Medellín en un solo lugar. 
                Explora sabores únicos y experiencias auténticas.
              </Text>
            </motion.div>
            
            {/* Botón de llamada a la acción */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6"
            >
              <button className="px-6 py-3 bg-[#6F4E37] hover:bg-[#A67C52] text-white rounded-full 
                transition-all duration-300 font-medium transform hover:scale-105 shadow-lg
                focus:outline-none focus:ring-2 focus:ring-[#D4A76A] focus:ring-opacity-50">
                Explorar cafeterías
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Indicador de desplazamiento */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          delay: 1.2,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center items-start p-1">
          <div className="w-1 h-3 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};