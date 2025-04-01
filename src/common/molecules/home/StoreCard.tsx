import React, { useState, memo } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Text } from '@/common/atoms/Text';
import { Coffee, MapPin, Heart, Mail, Phone } from '@/common/ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StoreCardProps {
  id: number;
  name: string;
  imageUrl: string;
  distance?: string;
  email: string;
  phone: string;
  description?: string;
}

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
  id,
  name,
  imageUrl,
  distance,
  email,
  phone,
  description = "Descubre sabores excepcionales y momentos únicos en nuestro espacio."
}: StoreCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  };

  // Especialidades genéricas para mantener la personalidad
  const specialties = ["Café de origen", "Métodos artesanales", "Pasteles caseros"];

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
              alt={`Tienda ${name}`}
              className="w-full h-full object-cover"
              variants={imageVariants}
              animate={isHovered ? "hover" : "normal"}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onError={(e) => {
                // Imagen de respaldo si la original falla
                e.currentTarget.src = "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg";
              }}
            />

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

            {/* Indicador de distancia (si está disponible) */}
            {distance && (
              <div className="absolute bottom-3 left-3 z-20 bg-white/80 backdrop-blur-sm text-[#6F4E37] text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {distance}
              </div>
            )}
          </div>

          {/* Contenido de la card */}
          <div className="p-4 flex-grow flex flex-col">
            {/* Nombre de la tienda */}
            <div className="flex justify-between items-start mb-2">
              <Text variant="h3" className="font-bold text-lg sm:text-xl text-[#2C1810] truncate">{name}</Text>
            </div>

            {/* Información adicional */}
            <div className="flex flex-col space-y-2 mt-1">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-[#A67C52] flex-shrink-0" />
                <Text variant="small" className="text-[#2C1810] text-xs truncate">{email}</Text>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-[#A67C52] flex-shrink-0" />
                <Text variant="small" className="text-[#2C1810] text-xs">{phone}</Text>
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
              {/* Botón "Ver sucursales" animado */}
              <motion.div
                className="flex-grow"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
              >
                <Link to={`/map`}>
                  <motion.button
                    className="w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-[#6F4E37] hover:bg-[#5D4130] text-amber-50 rounded-lg font-medium text-sm shadow-sm transition-colors group relative overflow-hidden"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span className="relative z-10">Ver sucursales</span>
                    <MapPin className="w-4 h-4 relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#A67C52] to-[#8D6E4C] opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </motion.div>

            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
