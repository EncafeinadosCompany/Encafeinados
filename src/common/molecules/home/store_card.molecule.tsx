import React, { useState, memo } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Text } from '@/common/atoms/common/text.atom';
import { Coffee, MapPin, Heart, Mail, Phone } from '@/common/ui/icons';
import { motion } from 'framer-motion';  
import { Link } from 'react-router-dom';

interface StoreCardProps {
  id: number;
  name: string;
  imageUrl: string;
  email: string;
  phone: string;
  description?: string;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const StoreCard = memo(({ 
  id, name, imageUrl, email, phone, 
  description = "Descubre sabores excepcionales y momentos únicos en nuestro espacio."
}: StoreCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  };

  const specialties = ["Café de origen", "Métodos artesanales", "Pasteles caseros"];

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4 }}
      className={`h-full transition-transform duration-300 ${isHovered ? 'translate-y-[-8px]' : ''}`}
    >
      <Card
        className="overflow-hidden h-full bg-white rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/40 to-transparent z-10"></div>

            <img 
              loading="lazy"
              decoding="async"
              src={imageUrl} 
              alt={`Tienda ${name}`}
              className={`w-full h-full object-cover transition-all duration-500 ease-out
                ${isHovered ? 'scale-110 brightness-105' : 'scale-100 brightness-100'}`}
              onError={(e) => {
                e.currentTarget.src = "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg";
              }}
            />

            <button
              className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm
                transition-transform duration-150 hover:scale-110 active:scale-90"
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <Text variant="h3" className="font-bold text-lg sm:text-xl text-[#2C1810] truncate">{name}</Text>
            </div>

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

            <div className="my-3 w-full h-px overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] transform origin-left transition-transform duration-300 
                  ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}
              ></div>
            </div>

            <div 
              className={`overflow-hidden transition-all duration-300 
                ${isHovered ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0'}`}
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
            </div>

            <div className="mt-auto pt-2 flex gap-2">
              <div 
                className={`flex-grow transition-all duration-300
                  ${isHovered ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'}`}
              >
                <Link to={`/map`}>
                  <button
                    className="w-full py-2.5 px-4 flex items-center justify-center gap-2 
                      bg-[#6F4E37] hover:bg-[#5D4130] text-amber-50 rounded-lg 
                      font-medium text-sm shadow-sm transition-all duration-200 
                      relative overflow-hidden hover:shadow-md active:scale-[0.98]"
                  >
                    <span className="relative z-10">Ver sucursales</span>
                    <MapPin className="w-4 h-4 relative z-10" />
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-[#A67C52] to-[#8D6E4C] 
                        opacity-0 hover:opacity-100 transition-opacity duration-300"
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

