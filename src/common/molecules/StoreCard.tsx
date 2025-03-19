import React, { useState } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Text } from '@/common/atoms/Text';
import { Coffee, Star, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface StoreCardProps {
  name: string;
  imageUrl: string;
  rating?: number;
  distance?: string;
  openTime?: string;
}

export const StoreCard = ({ 
  name, 
  imageUrl, 
  rating = 4.5, 
  distance = "2.3 km", 
  openTime = "08:00 - 20:00" 
}: StoreCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full bg-white rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0 flex flex-col">
          <div className="relative h-48 sm:h-52 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={name} 
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            <div className="absolute top-0 right-0 m-2 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center text-amber-500">
              <Star className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" />
              <span className="text-sm font-semibold">{rating}</span>
            </div>
          </div>
          <div className="p-4 flex-grow">
            <Text variant="h3" className="font-bold text-lg sm:text-xl mb-2 text-[#6F4E37]">{name}</Text>
            
            <div className="flex flex-col space-y-2 mt-3">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-[#A67C52]" />
                <Text variant="small" className="text-[#2C1810]">{distance}</Text>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-[#A67C52]" />
                <Text variant="small" className="text-[#2C1810]">{openTime}</Text>
              </div>
              <div className="flex items-center text-gray-600">
                <Coffee className="w-4 h-4 mr-2 text-[#A67C52]" />
                <Text variant="small" className="text-[#2C1810]">Especialidad: Café de origen</Text>
              </div>
            </div>
            
            <motion.div 
              className="mt-4 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-1 bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] rounded-full"></div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};