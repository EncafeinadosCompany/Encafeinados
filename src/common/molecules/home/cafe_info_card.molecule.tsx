import React from 'react';
import { Text } from '@/common/atoms/common/text.atom';
import { Button } from '@/common/ui/button';
import { Card, CardContent, CardFooter } from '@/common/ui/card';
import { Navigation, Clock, Phone, Coffee, Star, X, MapPin } from '@/common/ui/icons';
import { motion } from 'framer-motion';
import SafeNumericDisplay from '@/common/atoms/common/safe_numeric_display.atom';

interface CafeInfoCardProps {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  openingHours: string;
  phoneNumber: string;
  specialty: string;
  imageUrl: string;
  onNavigate: () => void;
  onClose: () => void;
}

export const CafeInfoCard: React.FC<CafeInfoCardProps> = ({
  name,
  address,
  distance,
  rating,
  openingHours,
  phoneNumber,
  specialty,
  imageUrl,
  onNavigate,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-0 left-0 right-0 z-40 p-4 md:p-0 md:bottom-8 md:left-8 md:right-auto md:max-w-md"
    >
      <Card className="bg-white shadow-xl overflow-hidden">
        <div className="relative h-48">
          <img 
            src={imageUrl || '/api/placeholder/400/300'} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>          <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 shadow-md flex items-center">
            <Star size={16} className="text-amber-500 mr-1" />
            <span className="text-sm font-medium">
              <SafeNumericDisplay 
                value={rating} 
                format={(val) => val.toFixed(1)}
                defaultValue="..."
              />
            </span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <Text variant="h3" className="text-xl font-bold text-[#6F4E37] mb-2">{name}</Text>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-start">
              <div className="mr-2 mt-1 text-[#A67C52]"><MapPin size={16} /></div>
              <div>
                <p className="text-sm text-gray-700">{address}</p>
                <p className="text-xs text-gray-500">{distance}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-2 text-[#A67C52]"><Clock size={16} /></div>
              <p className="text-sm text-gray-700">{openingHours}</p>
            </div>
            
            <div className="flex items-center">
              <div className="mr-2 text-[#A67C52]"><Phone size={16} /></div>
              <p className="text-sm text-gray-700">{phoneNumber}</p>
            </div>
            
            <div className="flex items-center">
              <div className="mr-2 text-[#A67C52]"><Coffee size={16} /></div>
              <p className="text-sm text-gray-700">Especialidad: {specialty}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={onNavigate} 
            className="w-full bg-[#6F4E37] hover:bg-[#5D3F28] text-white flex items-center justify-center gap-2"
          >
            <Navigation size={18} />
            <span>Navegar hasta aquí</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
