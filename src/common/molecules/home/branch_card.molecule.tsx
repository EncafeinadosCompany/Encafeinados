import React, { useState, memo, useEffect } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Text } from '@/common/atoms/common/text.atom';
import { Coffee, MapPin, Phone, Star, Clock } from '@/common/ui/icons';
import { motion } from 'framer-motion';  
import { Link } from 'react-router-dom';
import { useBranchAttributes } from '@/api/queries/branches/branch.query';
import { GoToButton } from '@/common/atoms/map/GoToButton';
import { generateBranchDescription, generateFallbackDescription, getLoadingDescription } from '@/common/utils/branches/description_generator.utils';

interface BranchCardProps {
  id: number;
  name: string;
  imageUrl: string;
  address: string;
  phone?: string;
  description?: string;
  rating?: string;
  isOpen?: boolean;
  attributes?: Array<{ 
    attributeId?: number;
    category?: string;
    attributeName: string; 
    value: string | null;
  }>;
  distance?: number;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const BranchCard = memo(({ 
  id, name, imageUrl, address, phone, 
  description = "Descubre sabores excepcionales y momentos únicos en nuestro espacio.",
  rating, isOpen = true, attributes = [], distance
}: BranchCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadAttributes, setShouldLoadAttributes] = useState(false);

  // Solo cargar atributos cuando se haga hover (más eficiente)
  const { data: attributesData, isLoading: attributesLoading } = useBranchAttributes(
    shouldLoadAttributes ? id : undefined
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!shouldLoadAttributes) {
      setShouldLoadAttributes(true);
    }
  };

  // Combinar atributos de props con los cargados dinámicamente, priorizando los dinámicos
  const allAttributes = (attributesData?.attributes && attributesData.attributes.length > 0) 
    ? attributesData.attributes // Mostrar todos los atributos, independientemente del valor
    : attributes; 
  
  const displayedAttributes = allAttributes.slice(0, 3);
  const totalAttributesCount = allAttributes.length;

  // Helper para obtener la descripción generada dinámicamente
  const getDescription = () => {
    // Si se están cargando los atributos, mostrar estado de carga
    if (attributesLoading && shouldLoadAttributes) {
      return getLoadingDescription();
    }
    
    // Si tenemos atributos, generar descripción dinámica
    if (attributesData?.attributes && attributesData.attributes.length > 0) {
      return generateBranchDescription({
        name,
        attributes: attributesData.attributes,
        isOpen,
        average_rating: rating
      });
    }
    
    // Fallback genérico con información básica disponible
    return generateFallbackDescription();
  };

  // Helper para obtener el tooltip de un atributo
  const getAttributeTooltip = (attribute: any) => {
    const category = attribute.category || 'Atributo';
    const value = attribute.value;
    return `${category}: ${attribute.attributeName}${value ? ` - ${value}` : ''}`;
  };

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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/40 to-transparent z-10"></div>

            <div className="absolute top-3 right-3 z-20">
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                isOpen 
                  ? 'bg-green-100/80 text-green-800 backdrop-blur-sm' 
                  : 'bg-red-100/80 text-red-800 backdrop-blur-sm'
              }`}>
                <Clock className="w-3 h-3" />
                {isOpen ? 'Abierto' : 'Cerrado'}
              </div>
            </div>

            {rating && (
              <div className="absolute bottom-3 right-3 z-20 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-gray-800">{Number(rating).toFixed(1)}</span>
              </div>
            )}

            <img 
              loading="lazy"
              decoding="async"
              src={imageUrl} 
              alt={`Sucursal ${name}`}
              className={`w-full h-full object-cover transition-all duration-500 ease-out
                ${isHovered ? 'scale-110 brightness-105' : 'scale-100 brightness-100'}`}
              onError={(e) => {
                e.currentTarget.src = "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg";
              }}
            />


          </div>

          <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <Text variant="h3" className="font-bold text-lg sm:text-xl text-[#2C1810] truncate">{name}</Text>
            </div>

            <div className="flex flex-col space-y-2 mt-1">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-[#A67C52] flex-shrink-0" />
                <Text variant="small" className="text-[#2C1810] text-xs truncate">{address}</Text>
              </div>
              {phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-[#A67C52] flex-shrink-0" />
                  <Text variant="small" className="text-[#2C1810] text-xs">{phone}</Text>
                </div>
              )}
              {distance && (
                <div className="text-xs text-[#6F4E37] font-medium">
                  A {distance.toFixed(1)} km de tu ubicación
                </div>
              )}
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
                {getDescription()}
              </Text>

              {(displayedAttributes.length > 0 || (attributesLoading && shouldLoadAttributes)) && (
                <div className="mb-3">
                  <div className="flex items-center mb-1">
                    <Coffee className="w-4 h-4 mr-2 text-[#A67C52]" />
                    <Text variant="small" className="text-[#2C1810] font-medium">Características:</Text>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1 pl-6">
                    {attributesLoading && shouldLoadAttributes ? (
                      <>
                        <div className="px-2 py-1 bg-gray-200 animate-pulse text-xs rounded-full w-16 h-6"></div>
                        <div className="px-2 py-1 bg-gray-200 animate-pulse text-xs rounded-full w-20 h-6"></div>
                        <div className="px-2 py-1 bg-gray-200 animate-pulse text-xs rounded-full w-14 h-6"></div>
                      </>
                    ) : displayedAttributes.length > 0 ? (
                      <>
                        {displayedAttributes.map((attribute, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#FAF3E0] text-[#6F4E37] text-xs rounded-full"
                            title={getAttributeTooltip(attribute)}
                          >
                            {attribute.attributeName}
                          </span>
                        ))}
                        {totalAttributesCount > 3 && (
                          <span className="px-2 py-1 bg-[#E8E8E8] text-[#6F4E37] text-xs rounded-full">
                            +{totalAttributesCount - 3} más
                          </span>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-2 flex gap-2">
              <div 
                className={`flex-grow transition-all duration-300
                  ${isHovered ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'}`}
              >
                <GoToButton 
                  text="Cafetería"
                  branchId={id}
                  mapRoute="public"
                  className={`cursor-pointer w-full py-2.5 px-4 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 
                    relative overflow-hidden hover:shadow-md active:scale-[0.98] ${
                    isOpen 
                      ? 'bg-[#6F4E37] hover:bg-[#5D4130] text-white border-0' 
                      : 'bg-gray-400 hover:bg-gray-500 text-white border-0'
                  }`}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

BranchCard.displayName = 'BranchCard';

export default BranchCard;
