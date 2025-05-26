import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Heart, Route, Wifi, Car, CreditCard, Coffee } from 'lucide-react';
import { Cafe } from '@/api/types/map/map_search.types';
import HighlightText from '@/common/atoms/HighlightText';
import { useBranchSchedules } from '@/api/queries/schedules/schedule.query';
import { getCurrentScheduleInfo, isBranchOpenNow } from '@/common/utils/schedules/schedule.utils';

interface CafeCardProps {
  cafe: Cafe;
  index: number;
  isActive: boolean;
  isFavorite: boolean;
  searchTerm: string;
  onCardClick: (id: number) => void;
  onFavoriteToggle: (id: number) => void;
  onNavigate: (id: number) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    }
  })
};

const CafeCard: React.FC<CafeCardProps> = ({
  cafe,
  index,
  isActive,
  isFavorite,
  searchTerm,
  onCardClick,
  onFavoriteToggle,
  onNavigate
}) => {
  // Obtener horarios reales de la API
  const { data: schedulesData } = useBranchSchedules(cafe.id);
  
  // Calcular estado actual basado en horarios reales
  const isCurrentlyOpen = schedulesData ? isBranchOpenNow(schedulesData) : cafe.isOpen;
  const currentInfo = schedulesData ? getCurrentScheduleInfo(schedulesData) : null;
  
  // Función para obtener ícono de atributo
  const getAttributeIcon = (attributeName: string) => {
    const name = attributeName.toLowerCase();
    if (name.includes('wifi') || name.includes('internet')) return <Wifi size={12} />;
    if (name.includes('parking') || name.includes('estacionamiento')) return <Car size={12} />;
    if (name.includes('tarjeta') || name.includes('card') || name.includes('pago')) return <CreditCard size={12} />;
    return <Coffee size={12} />;
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${isActive ? 'ring-2 ring-[#D4A76A]' : 'ring-1 ring-gray-100'}`}
      onClick={() => onCardClick(cafe.id)}
    >
      <div className="relative">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-36 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {cafe.tags.map((tag, i) => (
            <span key={i} className="text-xs font-medium bg-white/90 text-[#6F4E37] px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <motion.button
          className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(cafe.id);
          }}
        >
          <Heart
            size={16}
            className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#6F4E37]'}`}
          />
        </motion.button>
      </div>

      <div className="p-4 bg-white">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-[#2C1810] line-clamp-1">
            <HighlightText text={cafe.name} highlight={searchTerm} />
          </h3>
          {cafe.rating ? (
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={16} className="fill-amber-500" />
              <span className="font-medium">{cafe.rating}</span>
            </div>
          ) : (
            <div className="text-xs text-gray-400 font-medium">
              Sin reseñas
            </div>
          )}
        </div>        <div className="flex justify-between items-center mt-2">
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium
            ${isCurrentlyOpen 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
            }`}
          >
            {isCurrentlyOpen ? 'Abierto' : 'Cerrado'}
          </div>
          
          {/* Mostrar horario actual si está disponible */}
          {currentInfo && currentInfo.openTime && currentInfo.closeTime && (
            <div className="text-xs text-gray-600">
              {currentInfo.openTime} - {currentInfo.closeTime}
            </div>
          )}
        </div>        {/* Atributos de la cafetería */}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-[#6F4E37]" />
            <span>{cafe.distance}</span>
          </div>
          {/* Mostrar información adicional si está cerrado */}
          {!isCurrentlyOpen && currentInfo?.nextOpenTime && currentInfo?.nextOpenDay && (
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-amber-600" />
              <span className="text-xs">
                Abre {currentInfo.nextOpenDay} {currentInfo.nextOpenTime}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <motion.button
            className="flex-1 bg-[#6F4E37] text-white py-2 rounded-lg font-medium hover:bg-[#5d4230] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Ver detalles
          </motion.button>
          <motion.button
            className="w-10 h-10 flex items-center justify-center border border-[#6F4E37] text-[#6F4E37] rounded-lg hover:bg-[#6F4E37] hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(cafe.id);
            }}
          >
            <Route size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CafeCard;