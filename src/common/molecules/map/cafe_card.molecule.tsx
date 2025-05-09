import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Heart, Route } from 'lucide-react';
import { Cafe } from '@/api/types/map/map_search.types';
import HighlightText from '@/common/atoms/HighlightText';

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
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} className="fill-amber-500" />
            <span className="font-medium">{cafe.rating}</span>
            <span className="text-xs text-gray-500">({cafe.reviewCount})</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium">{cafe.rating}</span>
            <span className="text-xs text-gray-500">({cafe.reviewCount})</span>
          </div>
          
          {/* Indicador de estado */}
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium
            ${cafe.isOpen 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
            }`}
          >
            {cafe.isOpen ? 'Abierto' : 'Cerrado'}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-[#6F4E37]" />
            <span>{cafe.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-[#6F4E37]" />
            <span>{cafe.openTime}</span>
          </div>
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