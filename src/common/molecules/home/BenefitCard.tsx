// src/common/molecules/BenefitCard.tsx
import React from 'react';
import { Text } from '@/common/atoms/Text';
import { Card, CardContent } from '@/common/ui/card';
import { motion } from 'framer-motion';

interface BenefitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  index: number;
}

export const BenefitCard = ({ title, description, icon, imageSrc, index }: BenefitCardProps) => {
  // Alternamos el diseño para crear variedad visual
  const isEven = index % 2 === 0;

  return (
    <Card className="overflow-hidden border-none rounded-xl group relative h-full bg-gradient-to-br from-[#FAF3E0] to-white">
      {/* Fondo con gradiente y overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6F4E37]/5 to-[#D4A76A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Imagen de fondo decorativa con clip-path */}
      <div className={`absolute ${isEven ? 'right-0 top-0' : 'left-0 bottom-0'} w-1/2 h-1/2 overflow-hidden opacity-30 group-hover:opacity-50 transition-all duration-500`}>
        <div 
          className={`w-full h-full bg-cover bg-center transform ${isEven ? 'origin-top-right' : 'origin-bottom-left'} group-hover:scale-110 transition-transform duration-700`}
          style={{ backgroundImage: `url(${imageSrc})`, 
                  clipPath: isEven ? 'polygon(50% 0, 100% 0, 100% 100%, 0% 100%)' : 'polygon(0 0, 100% 0, 50% 100%, 0 100%)' }}
        ></div>
      </div>
      
      {/* Contenido */}
      <CardContent className="flex flex-col p-6 md:p-8 z-10 relative h-full">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center mb-6 ${isEven ? 'justify-start' : 'justify-end'}`}
        >
          <div className="rounded-full p-4 bg-gradient-to-br from-[#6F4E37] to-[#A67C52] text-white shadow-lg">
            {icon}
          </div>
        </motion.div>

        <div className={`${isEven ? 'text-left' : 'text-right'}`}>
          <Text variant="h3" className="text-xl font-bold mb-3 text-[#6F4E37] group-hover:text-[#2C1810] transition-colors duration-300">{title}</Text>
          <Text variant="p" className="text-[#A67C52] group-hover:text-[#6F4E37] transition-colors duration-300">{description}</Text>
        </div>
        
        {/* Línea decorativa */}
        <div className={`absolute h-1 bg-gradient-to-r from-[#D4A76A] to-[#A67C52] bottom-0 left-0 w-0 group-hover:w-full transition-all duration-700 ${isEven ? 'origin-left' : 'origin-right'}`}></div>
      </CardContent>
    </Card>
  );
};