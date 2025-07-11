import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Coffee, Navigation } from '@/common/ui/icons';
import { useNavigate } from 'react-router-dom';

interface MapTeaserProps {
  totalCafes: number;
  city: string;
}

export const MapTeaser = ({ totalCafes, city = "Medellín" }: MapTeaserProps) => {
  const navigate = useNavigate();

  const handleOpenMap = () => {
    navigate('/map');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pinVariants = {
    hover: {
      y: [0, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="pt-16 px-4 overflow-hidden"  >
      <motion.div
        className="max-w-6xl mx-auto bg-gradient-to-r from-[#6F4E37]/5 to-[#D4A76A]/10 rounded-3xl overflow-hidden relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4A76A]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#6F4E37]/10 rounded-full blur-3xl"></div>
        
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          <motion.div className="flex flex-col justify-center" variants={containerVariants}>
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6F4E37]/10 rounded-full mb-4 text-[#6F4E37] font-medium text-sm w-fit" variants={itemVariants}>
              <Coffee size={16} />
              <span>Encuentra tu café ideal</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-[#2C1810]"
              variants={itemVariants}
            >
              Explora {totalCafes}+ cafeterías en {city}
            </motion.h2>
            
            <motion.p 
              className="text-[#6F4E37] mb-6 max-w-md" 
              variants={itemVariants}
            >
              Descubre las mejores cafeterías cercanas, lee reseñas y encuentra tu próxima parada para un café excepcional.
            </motion.p>
            
            <motion.button
              onClick={handleOpenMap}
              className="group flex items-center gap-2 bg-[#6F4E37] text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-[#5a3e2c] w-fit cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Ver mapa interactivo</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Navigation size={18} className="transform -rotate-45" />
              </motion.div>
            </motion.button>

            <motion.div 
              className="mt-6 flex gap-4 items-center text-sm text-[#6F4E37]"
              variants={itemVariants}
            >
              
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative h-80"
            variants={itemVariants}
          >
            <motion.div 
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border border-[#D4A76A]/20 bg-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Map background with actual map style */}
              <div className="w-full h-full bg-[#F8F4EA] relative">
                {/* Map grid lines */}
                <div className="absolute inset-0 opacity-20" 
                  style={{
                    backgroundImage: 'linear-gradient(to right, #6F4E37 1px, transparent 1px), linear-gradient(to bottom, #6F4E37 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                ></div>
                
                {/* Map roads */}
                <div className="absolute h-0.5 w-4/5 bg-[#D4A76A] top-1/3 left-0 rounded-full"></div>
                <div className="absolute h-4/5 w-0.5 bg-[#D4A76A] top-1/4 left-1/3 rounded-full"></div>
                <div className="absolute h-0.5 w-3/5 bg-[#D4A76A] bottom-1/4 right-0 rounded-full"></div>
                
                {/* Water areas */}
                <motion.div 
                  className="absolute w-1/4 h-1/4 rounded-full bg-[#A2D2FF]/50 bottom-5 left-5"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
                
                {/* Regions/neighborhoods */}
                <div className="absolute w-2/5 h-2/5 rounded-lg bg-[#FAEDCD]/60 top-10 right-10"></div>
                <div className="absolute w-2/5 h-1/4 rounded-lg bg-[#E9EDC9]/60 bottom-16 right-1/4"></div>
                
                {/* Map pins overlay with improved visibility */}
                <motion.div 
                  className="absolute top-1/4 left-1/3 z-10"
                  variants={pinVariants}
                  whileHover="hover"
                >
                  <div className="relative">
                    <MapPin size={28} className="text-[#D4584E] drop-shadow-lg" />
                    <motion.div 
                      className="absolute -inset-1 rounded-full bg-[#D4584E]/20" 
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    ></motion.div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute top-1/2 right-1/4 z-10"
                  variants={pinVariants}
                  whileHover="hover"
                >
                  <div className="relative">
                    <MapPin size={24} className="text-[#A67C52] drop-shadow-lg" />
                    <motion.span className="absolute -top-6 -left-10 bg-white px-2 py-1 text-xs rounded shadow-md opacity-0 hover:opacity-100">Cafetería</motion.span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-1/3 left-1/2 z-10"
                  variants={pinVariants}
                  whileHover="hover"
                >
                  <div className="relative">
                    <MapPin size={32} className="text-[#D4A76A] drop-shadow-lg" />
                  </div>
                </motion.div>
                
                {/* Compass rose */}
                <div className="absolute top-4 right-4 bg-white/80 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Navigation size={20} className="text-[#6F4E37]" />
                  </motion.div>
                </div>
                
                {/* Your location indicator */}
                <div className="absolute bottom-1/4 right-1/3 flex items-center justify-center z-10">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-[#4285F4]/20 absolute"
                    variants={pulseVariants}
                    animate="pulse"
                  ></motion.div>
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-[#4285F4]/30 absolute"
                    variants={pulseVariants}
                    animate="pulse"
                    transition={{ delay: 0.5 }}
                  ></motion.div>
                  <motion.div 
                    className="w-4 h-4 rounded-full bg-[#4285F4] relative"
                  ></motion.div>
                </div>
              </div>
              
              {/* Map label */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-2 px-4 text-center text-sm font-medium text-[#6F4E37]">
                <motion.div 
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <MapPin size={14} />
                  <span>Explora cafeterías en {city}</span>
                </motion.div>
              </div>
              
              {/* Call to action overlay */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors"
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                <motion.span 
                  onClick={handleOpenMap}
                  className="bg-[#6F4E37] text-white px-4 py-2 rounded-full font-medium shadow-lg cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                >
                  Abrir mapa interactivo
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};