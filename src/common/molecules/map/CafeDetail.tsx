import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Clock, 
  MapPin, 
  Navigation, 
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Cafe } from '@/common/types/map/mapTypes';
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover";

interface CafeDetailProps {
  cafe: Cafe;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  navigateToCafe: (id: number) => void;
  onClose: () => void;
  copyToClipboard: (text: string) => void;
  copied: boolean;
}

const CafeDetail: React.FC<CafeDetailProps> = ({
  cafe,
  favorites,
  toggleFavorite,
  navigateToCafe,
  onClose,
  copyToClipboard,
  copied
}) => {
  return (
    <div key={cafe.id} className="relative flex flex-col h-full">
      <div className="relative h-48 w-full md:h-64">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} className="text-[#6F4E37] transform rotate-45" />
        </button>

        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="font-bold text-2xl md:text-3xl text-white">{cafe.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={18} className="fill-amber-400" />
              <span className="font-medium text-white">{cafe.rating}</span>
              <span className="text-sm text-white/80">({cafe.reviewCount} reseñas)</span>
            </div>
            <motion.button
              className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(cafe.id);
              }}
            >
              <Heart
                size={18}
                className={`${favorites.includes(cafe.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-auto md:p-6 md:pb-8 flex-1">
        {/* Información de la tienda */}
        <div className="md:mb-3 text-[#6F4E37]/80 text-sm md:text-base">
          <span className="font-medium">{cafe.storeName}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-[#6F4E37]">
              <Clock size={18} />
              <span className="font-medium">{cafe.openTime}</span>
            </div>
            <span className={`text-xs py-0.5 px-2 rounded-full font-medium ${cafe.status === "APPROVED" 
                ? 'bg-green-50 text-green-600' 
                : cafe.status === "PENDING" 
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-red-50 text-red-600'
              }`}>
              {cafe.status === "APPROVED" 
                ? 'Abierto ahora' 
                : cafe.status === "PENDING" 
                  ? 'En revisión' 
                  : 'Cerrado'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-[#6F4E37]">
              <MapPin size={18} />
              <span className="font-medium">{cafe.distance} de distancia</span>
            </div>
            <motion.button
              className="text-[#6F4E37] bg-[#FAF3E0] p-2 rounded-lg hover:bg-[#FAF3E0]/70 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateToCafe(cafe.id)}
            >
              <Navigation size={18} />
            </motion.button>
          </div>
        </div>

        {/* Dirección completa - visible en desktop */}
        <div className="mb-5 bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-[#2C1810] mb-1">Dirección</h4>
          <p className="text-gray-700">{cafe.address || "Dirección no disponible"}</p>
        </div>

        {/* Sección de Redes Sociales - reemplaza características */}
        {cafe.socialNetworks && cafe.socialNetworks.length > 0 ? (
          <div className="py-3 border-b border-gray-100">
            <h4 className="font-medium text-[#2C1810] mb-2">Encuéntranos en redes</h4>
            <div className="flex flex-wrap gap-2">
              {cafe.socialNetworks.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-[#6F4E37] px-3 py-1.5 rounded-full transition-colors"
                >
                  {social.social_network_name.toLowerCase().includes('facebook') && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {social.social_network_name.toLowerCase().includes('instagram') && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {social.social_network_name.toLowerCase().includes('twitter') && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <span className="text-sm font-medium">{social.social_network_name}</span>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-3 border-b border-gray-100">
            <h4 className="font-medium text-[#2C1810] mb-2">Características</h4>
            <div className="flex flex-wrap gap-2">
              {cafe.tags.map((tag, i) => (
                <span key={i} className="text-sm font-medium bg-gray-50 text-[#6F4E37] px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
              <span className="text-sm font-medium bg-gray-50 text-[#6F4E37] px-3 py-1 rounded-full">
                Wi-Fi
              </span>
            </div>
          </div>
        )}

        {/* Información de contacto */}
        {cafe.phone && (
          <div className="py-3 border-t border-gray-100">
            <h4 className="font-medium text-[#2C1810] mb-2">Contacto</h4>
            <p className="text-[#6F4E37]">{cafe.phone || 'No disponible'}</p>
          </div>
        )}

        <div className="flex gap-3 py-4">
          {cafe.phone ? (
            <motion.a
              href={`tel:${cafe.phone}`}
              className="flex-1 bg-[#6F4E37] text-white py-3 rounded-xl font-medium hover:bg-[#5d4230] transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white"/>
              </svg>
              <span>Llamar</span>
            </motion.a>
          ) : (
            <motion.button
              className="flex-1 bg-[#6F4E37] text-white py-3 rounded-xl font-medium hover:bg-[#5d4230] transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateToCafe(cafe.id)}
            >
              <Navigation size={18} />
              <span>Navegar</span>
            </motion.button>
          )}
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  className="w-12 h-12 flex items-center justify-center border border-[#6F4E37] text-[#6F4E37] rounded-xl hover:bg-[#6F4E37] hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={18} />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-64 z-[500] p-0 bg-white shadow-xl border border-gray-200 rounded-xl" 
                align="end"
                side="top"
                sideOffset={16}
                avoidCollisions={true}
              >
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Compartir cafetería</h3>
                  <div className="flex flex-col gap-3">
                    <button
                      className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                      onClick={() => copyToClipboard(`https://maps.google.com/maps?q=${cafe.latitude},${cafe.longitude}`)}
                    >
                      <Copy size={18} className="text-[#6F4E37]" />
                      <span className="flex-1">{copied ? 'Link copiado! ✓' : 'Copiar enlace'}</span>
                    </button>
                    
                    <a 
                      className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      href={`https://maps.google.com/maps?q=${cafe.latitude},${cafe.longitude}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={18} className="text-[#6F4E37]" />
                      <span>Abrir en Google Maps</span>
                    </a>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetail;