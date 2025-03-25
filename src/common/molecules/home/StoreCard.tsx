import React, { useState, memo } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Text } from '@/common/atoms/Text';
import { Coffee, Star, MapPin, Clock, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoreCardProps {
  name: string;
  imageUrl: string;
  rating?: number;
  distance?: string;
  openTime?: string;
  description?: string;
  specialties?: string[];
  onNavigate?: () => void;
}

// Variantes de animación extraídas para mejor rendimiento
const cardVariants = {
  hover: { 
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const imageVariants = {
  hover: { scale: 1.1, filter: 'brightness(1.05)' },
  normal: { scale: 1, filter: 'brightness(1)' }
};

const buttonVariants = {
  hover: { scale: 1.03, boxShadow: "0 4px 12px rgba(111, 78, 55, 0.25)" },
  tap: { scale: 0.97 }
};

export const StoreCard = memo(({ 
  name, 
  imageUrl, 
  rating = 4.5, 
  distance = "2.3 km", 
  openTime = "08:00 - 20:00",
  description = "Cafetería con opciones orgánicas y métodos de preparación especiales.",
  specialties = ["Café de origen", "Métodos artesanales", "Pasteles caseros"],
  onNavigate
}: StoreCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card 
        className="overflow-hidden h-full bg-white rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0 flex flex-col h-full">
        
          <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl">
            {/* Gradiente superior */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/40 to-transparent z-10"></div>
            
            {/* Imagen con animación optimizada */}
            <motion.img 
              src={imageUrl} 
              alt={`Cafetería ${name}`}
              className="w-full h-full object-cover"
              variants={imageVariants}
              animate={isHovered ? "hover" : "normal"}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            
            {/* Rating badge */}
            <div className="absolute top-3 right-3 z-20">
              <div className="bg-white px-2 py-1 rounded-full flex items-center shadow-md">
                <Star className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" />
                <span className="text-sm font-semibold text-gray-800">{rating}</span>
              </div>
            </div>
            
            {/* Botón de favoritos optimizado */}
            <motion.button
              className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </motion.button>
            
            {/* Indicador de estado (abierto/cerrado) */}
            <div className="absolute bottom-3 left-3 z-20 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
              Abierto
            </div>
          </div>
          
          {/* Contenido de la card */}
          <div className="p-4 flex-grow flex flex-col">
            {/* Nombre de la cafetería */}
            <div className="flex justify-between items-start mb-2">
              <Text variant="h3" className="font-bold text-lg sm:text-xl text-[#2C1810] truncate">{name}</Text>
            </div>
            
            {/* Información adicional */}
            <div className="flex flex-col space-y-2 mt-1">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-[#A67C52] flex-shrink-0" />
                <Text variant="small" className="text-[#2C1810] truncate">{distance}</Text>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-[#A67C52] flex-shrink-0" />
                <Text variant="small" className="text-[#2C1810]">{openTime}</Text>
              </div>
            </div>
            
            {/* Línea divisoria animada */}
            <motion.div 
              className="my-3 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="h-px bg-gradient-to-r from-[#D4A76A] to-[#6F4E37]"></div>
            </motion.div>
            
            {/* Contenido expandido al hacer hover - con optimización de renderizado */}
            <AnimatePresence>
              {isHovered && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Text variant="small" className="text-[#6F4E37] text-xs mb-3 line-clamp-2">
                    {description}
                  </Text>
                  
                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <Coffee className="w-4 h-4 mr-2 text-[#A67C52]" />
                      <Text variant="small" className="text-[#2C1810] font-medium">Especialidades:</Text>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 pl-6">
                      {specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-[#FAF3E0] text-[#6F4E37] text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Contenedor para los botones */}
            <div className="mt-auto pt-2 flex gap-2">
              {/* Botón "Ver detalles" */}
              <motion.div
              className="flex-grow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10
              }}
              transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
              >
              <motion.button 
                className="w-full py-2 flex items-center justify-center bg-gradient-to-r from-[#6F4E37] to-[#A67C52] text-white rounded-full font-medium text-sm"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span>Ver detalles</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
              </motion.div>
              
              {/* Botón "Visitar" modificado para mayor notoriedad */}
              <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8
              }}
              transition={{ duration: 0.3, delay: isHovered ? 0.2 : 0 }}
              >
              <motion.button 
                onClick={onNavigate}
                className="h-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4A76A] to-[#A67C52] text-white rounded-full shadow-lg font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Visitar"
              >
                <span>Visitar</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Asignar nombre para DevTools
StoreCard.displayName = 'StoreCard';