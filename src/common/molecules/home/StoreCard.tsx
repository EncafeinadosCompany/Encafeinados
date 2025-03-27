'use client'
import React, { useState, memo } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Text } from '@/common/atoms/Text';
import { Phone, BadgeCheck, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoreCardProps {
  id: number;
  name: string;
  imagenUrl?: string;
  phone_number: string;
  email: string;
  status: string;
  onNavigate?: () => void;
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
  imagenUrl,
  phone_number,
  email,
  status,
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
      initial="initial"
      animate="animate"
      whileHover="hover"
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
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/40 to-transparent z-10"></div>

            <div className="w-full h-full relative overflow-hidden">
              {imagenUrl ? (
                <motion.img
                  src={imagenUrl}
                  alt={`Tienda ${name}`}
                  className="w-full h-full object-cover"
                  variants={imageVariants}
                  animate={isHovered ? "hover" : "normal"}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
            </div>

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

            <div className={`absolute bottom-3 left-3 z-20 ${
              status === 'APROBADO' ? 'bg-green-500' : 'bg-yellow-500'
            } text-white text-xs font-medium px-2 py-1 rounded-full flex items-center`}>
              <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
              {status}
            </div>
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <Text variant="h3" className="font-bold text-lg sm:text-xl text-[#2C1810] truncate">
                {name}
              </Text>
            </div>

            <div className="flex flex-col space-y-2 mt-1">
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-[#A67C52] flex-shrink-0" />
                <Text variant="small" className="text-[#2C1810] truncate">
                  {phone_number}
                </Text>
              </div>
              <div className="flex items-center text-gray-600">
                <BadgeCheck className="w-4 h-4 mr-2 text-[#A67C52] flex-shrink-0" />
                <Text variant="small" className="text-[#2C1810] truncate">
                  {email}
                </Text>
              </div>
            </div>

            <motion.div
              className="my-3 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="h-px bg-gradient-to-r from-[#D4A76A] to-[#6F4E37]"></div>
            </motion.div>

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
                    ID: {id} • Estado: {status}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-2 flex gap-2">
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

StoreCard.displayName = 'StoreCard';