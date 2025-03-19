import React, { useState } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Text } from '@/common/atoms/Text';
import { Coffee, Star, MapPin, Clock, ChevronRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoreCardProps {
  name: string;
  imageUrl: string;
  rating?: number;
  distance?: string;
  openTime?: string;
  description?: string;
  specialties?: string[];
}

export const StoreCard = ({ 
  name, 
  imageUrl, 
  rating = 4.5, 
  distance = "2.3 km", 
  openTime = "08:00 - 20:00",
  description = "Cafetería con opciones orgánicas y métodos de preparación especiales.",
  specialties = ["Café de origen", "Métodos artesanales", "Pasteles caseros"]
}: StoreCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card 
        className="overflow-hidden shadow-lg h-full bg-white rounded-2xl border-0 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          boxShadow: isHovered 
            ? '0 20px 25px -5px rgba(111, 78, 55, 0.1), 0 10px 10px -5px rgba(111, 78, 55, 0.04)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <CardContent className="p-0 mt-[-25px] flex flex-col h-full ">
          {/* Contenedor de la imagen */}
          <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl">
            {/* Gradiente superior */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/40 to-transparent z-10"></div>
            
            {/* Imagen */}
            <motion.img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
              animate={{ 
          scale: isHovered ? 1.1 : 1,
          filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            
            {/* Rating badge */}
            <div className="absolute top-3 right-3 z-20 flex items-center">
              <motion.div 
          className="bg-white px-2 py-1 rounded-full flex items-center shadow-md"
          animate={{ 
            boxShadow: isHovered 
              ? '0 0 12px 0 rgba(255, 191, 0, 0.5)' 
              : '0 2px 4px rgba(0,0,0,0.1)' 
          }}
          transition={{ duration: 0.3 }}
              >
          <Star className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" />
          <span className="text-sm font-semibold text-gray-800">{rating}</span>
              </motion.div>
            </div>
            
            {/* Botón de favoritos */}
            <motion.button
              className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
              }}
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
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="h-px bg-gradient-to-r from-[#D4A76A] to-[#6F4E37]"></div>
            </motion.div>
            
            {/* Contenido expandido al hacer hover */}
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
            
            {/* Botón "Ver detalles" */}
            <motion.div
              className="mt-auto pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10
              }}
              transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
            >
              <motion.button 
                className="w-full py-2 flex items-center justify-center bg-gradient-to-r from-[#6F4E37] to-[#A67C52] text-white rounded-full font-medium text-sm"
                whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(111, 78, 55, 0.25)" }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Ver detalles</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};