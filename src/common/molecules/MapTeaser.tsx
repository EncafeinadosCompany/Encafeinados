import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Coffee, Navigation } from 'lucide-react';
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
    <section className="py-16 px-4 overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto bg-gradient-to-r from-[#6F4E37]/5 to-[#D4A76A]/10 rounded-3xl overflow-hidden relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4A76A]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#6F4E37]/10 rounded-full blur-3xl"></div>
        
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Left text content */}
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
              className="group flex items-center gap-2 bg-[#6F4E37] text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-[#5a3e2c] w-fit"
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
          
          {/* Right map preview */}
          <motion.div 
            className="relative h-80"
            variants={itemVariants}
          >
            <motion.div 
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border border-[#D4A76A]/20 bg-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img 
                src="/api/placeholder/600/400" 
                alt="Vista previa del mapa" 
                className="w-full h-full object-cover opacity-90"
              />
              
              {/* Map pins overlay */}
              <div className="absolute inset-0">
                <motion.div 
                  className="absolute top-1/4 left-1/3"
                  variants={pinVariants}
                  whileHover="hover"
                >
                  <MapPin size={28} className="text-[#6F4E37] drop-shadow-lg" />
                </motion.div>
                
                <motion.div 
                  className="absolute top-1/2 right-1/4"
                  variants={pinVariants}
                  whileHover="hover"
                >
                  <MapPin size={24} className="text-[#A67C52] drop-shadow-lg" />
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-1/3 left-1/2"
                  variants={pinVariants}
                  whileHover="hover"
                >
                  <MapPin size={32} className="text-[#D4A76A] drop-shadow-lg" />
                </motion.div>
              </div>
              
              {/* Pulse effect for "you are here" */}
              <div className="absolute bottom-1/4 right-1/3 flex items-center justify-center">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-[#6F4E37]/20 absolute"
                  variants={pulseVariants}
                  animate="pulse"
                ></motion.div>
                <motion.div 
                  className="w-8 h-8 rounded-full bg-[#6F4E37]/30 absolute"
                  variants={pulseVariants}
                  animate="pulse"
                  transition={{ delay: 0.5 }}
                ></motion.div>
                <motion.div 
                  className="w-4 h-4 rounded-full bg-[#6F4E37] relative"
                ></motion.div>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF3E0]/80 to-transparent"></div>
              
              {/* Map controls mockup */}
              <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2 shadow-md">
                <div className="flex flex-col gap-2">
                  <button className="w-8 h-8 rounded-md bg-[#6F4E37]/10 flex items-center justify-center text-[#6F4E37]">+</button>
                  <button className="w-8 h-8 rounded-md bg-[#6F4E37]/10 flex items-center justify-center text-[#6F4E37]">−</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};