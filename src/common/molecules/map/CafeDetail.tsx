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
import { normalizeSocialNetwork, SocialNetworkType } from '@/common/utils/socialNetworks';

const determineNetworkType = (social: any): 'facebook' | 'instagram' | 'twitter' | 'other' => {
  if (!social || !social.url) return 'other';
  
  const url = social.url.toLowerCase();
  
  if (url.includes('facebook') || url.includes('fb.com')) return 'facebook';
  if (url.includes('instagram') || url.includes('ig.com')) return 'instagram';
  if (url.includes('twitter') || url.includes('x.com')) return 'twitter';
  
  if (social.social_network_id === 1) return 'facebook';
  if (social.social_network_id === 2) return 'instagram';
  if (social.social_network_id === 3) return 'twitter';
  
  return 'other';
};

const getNetworkDisplayName = (social: any, networkType: string): string => {
 
  if (social.social_network_name) return social.social_network_name;
  switch (networkType) {
    case 'facebook': return 'Facebook';
    case 'instagram': return 'Instagram';
    case 'twitter': return 'Twitter';
    default: return 'Sitio web';
  }
};

const renderSocialIcon = (type: SocialNetworkType) => {
  switch (type) {
    case 'facebook':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
};

interface CafeDetailProps {
  cafe: Cafe;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  navigateToCafe: (id: number) => void;
  startRoute: (id: number) => void;
  onClose: () => void;
  copyToClipboard: (text: string) => void;
  copied: boolean;
}

const CafeDetail: React.FC<CafeDetailProps> = ({
  cafe,
  favorites,
  toggleFavorite,
  navigateToCafe,
  startRoute,
  onClose,
  copyToClipboard,
  copied
}) => {
  const renderSocialNetworks = () => {
    if (!cafe.socialNetworks || cafe.socialNetworks.length === 0) {
      return null;
    }
    const hasManyNetworks = cafe.socialNetworks.length > 3;

    return (
      <div className={`py-3 ${!hasManyNetworks ? 'border-b border-gray-100' : ''}`}>
        <h4 className="font-medium text-[#2C1810] mb-2 flex items-center justify-between">
          <span>Redes sociales</span>
          {hasManyNetworks && (
            <span className="text-xs text-[#6F4E37]/70">
              {cafe.socialNetworks.length} disponibles
            </span>
          )}
        </h4>
        
        <div className={`${hasManyNetworks ? 'grid grid-cols-2 md:grid-cols-3 gap-2' : 'flex flex-wrap gap-2'}`}>
          {cafe.socialNetworks.map((social, idx) => {
            const normalizedNetwork = normalizeSocialNetwork(social);
            return (
              <a 
                key={idx}
                href={normalizedNetwork.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-[#6F4E37] 
                  ${hasManyNetworks ? 'px-3 py-2 rounded-md' : 'px-3 py-1.5 rounded-full'} 
                  transition-colors hover:shadow-sm
                `}
              >
                {renderSocialIcon(normalizedNetwork.type)}
                <span className={`${hasManyNetworks ? 'text-xs' : 'text-sm'} font-medium truncate`}>
                  {normalizedNetwork.displayName}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-full max-h-full">
      <div className="relative h-48 md:h-auto md:w-[40%] lg:w-[40%] xl:w-1/3">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <button
          onClick={onClose}
          aria-label="Cerrar detalles"
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors z-10"
        >
          <ArrowLeft size={20} className="text-[#6F4E37] transform rotate-45" />
        </button>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="font-bold text-2xl md:text-3xl lg:text-3xl text-white line-clamp-2">{cafe.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={16} className="fill-amber-400" />
              <span className="font-medium text-white">{cafe.rating}</span>
              <span className="text-xs text-white/80">({cafe.reviewCount} reseñas)</span>
            </div>
            <motion.button
              className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(cafe.id);
              }}
              aria-label={favorites.includes(cafe.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart
                size={18}
                className={`${favorites.includes(cafe.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Contenido principal con scroll optimizado */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-5 lg:p-6">
          {/* Título visible solo en móvil */}
          <h2 className="text-xl font-bold text-[#2C1810] md:hidden">{cafe.name}</h2>
          
          {/* Calificación visible solo en móvil */}
          <div className="flex items-center gap-1 text-amber-500 mb-4 md:hidden">
            <Star size={16} className="fill-amber-500" />
            <span className="font-medium">{cafe.rating}</span>
            <span className="text-sm text-gray-500">({cafe.reviewCount} reseñas)</span>
          </div>
          
          {/* Grid adaptativo para diferentes tamaños de pantalla */}
          <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-6 xl:grid-cols-12">
            {/* Primera columna (información principal) */}
            <div className="xl:col-span-5">
              {/* Dirección */}
              <div className="mb-4 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-[#2C1810] mb-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#6F4E37]" />
                  <span>Dirección</span>
                </h4>
                <p className="text-gray-700 pl-5">{cafe.address || "Dirección no disponible"}</p>
              </div>
      
              <div className="bg-white rounded-lg">
                {renderSocialNetworks()}
              </div>
            </div>
            <div className="xl:col-span-7 md:pl-0 lg:pl-1">
              {cafe.phone && (
                <div className="py-3 mt-3 md:mt-0 border-t md:border-t-0 border-gray-100">
                  <h4 className="font-medium text-[#2C1810] mb-2 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#6F4E37]">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Contacto</span>
                  </h4>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 pl-5 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-[#6F4E37] font-medium">{cafe.phone}</span>
                  </div>
                </div>
              )}
              
              {/* Etiquetas/Tags si existen - Presentación mejorada */}
              {cafe.tags && cafe.tags.length > 0 && (
                <div className="py-3 border-t md:border-t-0 border-gray-100">
                  <h4 className="font-medium text-[#2C1810] mb-2">Características</h4>
                  <div className={`flex flex-wrap gap-2 ${cafe.tags.length > 6 ? 'max-h-24 overflow-y-auto pr-1' : ''}`}>
                    {cafe.tags.map((tag, idx) => (
                      <span key={idx} className="inline-block px-2.5 py-1 bg-[#F3D19E]/20 text-[#6F4E37] text-xs rounded-full whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Botones de acción - Mejorados para mejor usabilidad */}
              <div className="flex flex-col gap-3 py-4 md:mt-auto sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 -mx-4 md:-mx-5 lg:-mx-6 px-4 md:px-5 lg:px-6">
                {/* Botones principales en flex para móvil, grid para escritorio */}
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                  {/* Botón de iniciar ruta (nuevo botón principal) */}
                  <motion.button
                    className="flex-1 bg-[#6F4E37] text-white py-3 md:py-3 rounded-xl font-medium hover:bg-[#5d4230] transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startRoute(cafe.id)}
                  >
                    <Navigation size={16} />
                    <span>Iniciar ruta</span>
                  </motion.button>
                  
                  {/* Botón secundario: Llamar o navegar */}
                  {cafe.phone ? (
                    <motion.a
                      href={`tel:${cafe.phone}`}
                      className="flex-1 bg-white border border-[#6F4E37] text-[#6F4E37] py-3 md:py-3 rounded-xl font-medium hover:bg-[#6F4E37]/5 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Llamar</span>
                    </motion.a>
                  ) : (
                    <motion.button
                      className="flex-1 bg-white border border-[#6F4E37] text-[#6F4E37] py-3 md:py-3 rounded-xl font-medium hover:bg-[#6F4E37]/5 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigateToCafe(cafe.id)}
                    >
                      <MapPin size={16} />
                      <span>Ver en mapa</span>
                    </motion.button>
                  )}
                </div>
                
                {/* Fila inferior con botón de compartir */}
                <div className="flex justify-end">
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <motion.button
                          className="w-12 h-12 flex items-center justify-center border border-[#6F4E37] text-[#6F4E37] rounded-xl hover:bg-[#6F4E37] hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Share2 size={16} />
                        </motion.button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-64 md:w-72 z-[500] p-0 bg-white shadow-xl border border-gray-200 rounded-xl" 
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
                              <Copy size={16} className="text-[#6F4E37]" />
                              <span className="flex-1">{copied ? 'Link copiado! ✓' : 'Copiar enlace'}</span>
                            </button>
                            
                            <a 
                              className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                              href={`https://maps.google.com/maps?q=${cafe.latitude},${cafe.longitude}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink size={16} className="text-[#6F4E37]" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetail;