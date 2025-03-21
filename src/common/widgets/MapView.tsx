import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Filter, Coffee, Star, Clock, MapPin, Heart, Share2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Definir tipos para las props del MapFocus
interface MapFocusProps {
  cafeId: number | null;
  cafes: Array<any>;
  positions: Array<{id: number, lat: number, lng: number}>;
}

// Componente para centrar el mapa en el café seleccionado
const MapFocus = ({ cafeId, cafes, positions }: MapFocusProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (cafeId) {
      const position = positions.find(pos => pos.id === cafeId);
      if (position) {
        map.flyTo([position.lat, position.lng], 15, {
          duration: 2
        });
      }
    }
  }, [cafeId, map, positions]);
  
  return null;
};

export const MapView = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeCafe, setActiveCafe] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  

  const cafePositions = [
    { id: 1, lat: 6.2476 + 0.015, lng: -75.5658 - 0.010 },
    { id: 2, lat: 6.2476 - 0.008, lng: -75.5658 + 0.015 },
    { id: 3, lat: 6.2476 + 0.005, lng: -75.5658 + 0.008 }
  ];
  
  useEffect(() => {
    // Simulamos la carga del mapa
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Datos de cafés enriquecidos
  const cafes = [
    { 
      id: 1, 
      name: "Pergamino Café", 
      rating: 4.8, 
      reviewCount: 124,
      distance: "0.3 km", 
      openTime: "7:00 AM - 8:00 PM", 
      image: "https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      tags: ["Specialty", "Brunch"] 
    },
    { 
      id: 2, 
      name: "Velvet Café", 
      rating: 4.6, 
      reviewCount: 98,
      distance: "0.5 km", 
      openTime: "8:00 AM - 6:00 PM", 
      image: "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      tags: ["Pastries", "Quiet"] 
    },
    { 
      id: 3, 
      name: "Café Revolución", 
      rating: 4.5, 
      reviewCount: 76,
      distance: "0.8 km", 
      openTime: "7:30 AM - 7:00 PM", 
      image: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      tags: ["Workspace", "Local"] 
    },
  ];
  
  // Animaciones para distintos elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
// Interface for animation variants
interface CardVariants {
    hidden: {
        opacity: number;
        y: number;
    };
    visible: (i: number) => {
        opacity: number;
        y: number;
        transition: {
            delay: number;
            duration: number;
        };
    };
    [key: string]: any;
}

const cardVariants: CardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
        opacity: 1, 
        y: 0,
        transition: { 
            delay: i * 0.1,
            duration: 0.5
        }
    })
};
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  // Personalizar el icono del marcador
  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
  
  return (
    <motion.div 
      className="h-screen w-full relative bg-gray-50 overflow-hidden font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {!mapLoaded && (
          <motion.div 
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center"
            exit={{ 
              opacity: 0,
              transition: { duration: 0.7, ease: "easeInOut" }
            }}
          >
            <motion.div 
              className="w-16 h-16 text-[#6F4E37]"
              animate={{ 
                rotate: 360,
                transition: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            >
              <Coffee size={64} />
            </motion.div>
            <motion.p 
              className="mt-4 text-[#6F4E37] font-medium"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                transition: { duration: 1.5, repeat: Infinity }
              }}
            >
              Cargando tu experiencia cafetera...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header with back button */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-white/90 to-white/0 pt-4 pb-8 px-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg flex items-center gap-2 hover:bg-white transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-[#6F4E37] group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="pr-2 text-[#6F4E37] font-medium hidden md:inline">Volver</span>
          </Link>
          
          <motion.div 
            className={`relative transition-all duration-300 ${searchFocused ? 'w-full md:w-96' : 'w-48 md:w-64'}`}
            layout
          >
            <input 
              type="text" 
              placeholder="Buscar cafeterías..." 
              className="w-full h-11 pl-10 pr-12 rounded-full shadow-lg border-none outline-none focus:ring-2 focus:ring-[#D4A76A] transition-all duration-300"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]" size={18} />
            <motion.button 
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#6F4E37] text-white p-1.5 rounded-full hover:bg-[#5d4230] transition-colors duration-300"
              whileTap={{ scale: 0.9 }}
            >
              <Filter size={16} />
            </motion.button>
          </motion.div>
          
          <div className="w-10 md:hidden"></div> {/* Spacer for mobile layout */}
        </div>
      </div>
      
      {/* Map Container */}
      <div className="absolute inset-0 z-10">
        <MapContainer 
          center={[6.2476, -75.5658]} 
          zoom={14} 
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {cafePositions.map(position => (
            <Marker 
              key={position.id} 
              position={[position.lat, position.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  setActiveCafe(position.id);
                  setShowSidebar(true);
                },
              }}
            >
              <Popup className="cafe-popup">
                {cafes.find(cafe => cafe.id === position.id)?.name}
              </Popup>
            </Marker>
          ))}
          
          <MapFocus cafeId={activeCafe} cafes={cafes} positions={cafePositions} />
        </MapContainer>
        
        {/* User location indicator */}
        <motion.div 
          className="absolute bottom-28 right-4 z-30 bg-white rounded-full p-3 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Navigation size={20} className="text-[#6F4E37]" />
        </motion.div>
      </div>
      
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            className="absolute top-0 bottom-0 right-0 w-full md:w-96 bg-white z-20 shadow-2xl rounded-l-3xl md:rounded-l-3xl overflow-hidden"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="h-full flex flex-col">
              <div className="p-6 pt-20 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#2C1810] flex items-center gap-2">
                  <Coffee size={20} className="text-[#6F4E37]" />
                  <span>Cafeterías cercanas</span>
                </h2>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="text-[#6F4E37] md:hidden bg-gray-50 rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 pb-32">
                <motion.div className="space-y-4">
                  {cafes.map((cafe, index) => (
                    <motion.div 
                      key={cafe.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className={`rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${activeCafe === cafe.id ? 'ring-2 ring-[#D4A76A]' : 'ring-1 ring-gray-100'}`}
                      onClick={() => setActiveCafe(cafe.id)}
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
                        >
                          <Heart size={16} className="text-[#6F4E37]" />
                        </motion.button>
                      </div>
                      
                      <div className="p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-[#2C1810] line-clamp-1">{cafe.name}</h3>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={16} className="fill-amber-500" />
                            <span className="font-medium">{cafe.rating}</span>
                            <span className="text-xs text-gray-500">({cafe.reviewCount})</span>
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
                          >
                            <Share2 size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle sidebar button (mobile) */}
      {!showSidebar && (
        <motion.button
          className="absolute bottom-6 right-6 z-30 bg-[#6F4E37] text-white p-4 rounded-full shadow-xl md:hidden"
          onClick={() => setShowSidebar(true)}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          whileTap={{ scale: 0.9 }}
        >
          <Coffee size={24} />
        </motion.button>
      )}
      
      {/* Selected Cafe Popup - Bottom sheet on mobile, centered card on desktop */}
      <AnimatePresence>
        {activeCafe && (
          <motion.div 
            className="absolute md:left-1/2 md:right-auto md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 bottom-0 md:w-96 md:h-auto bg-white md:rounded-2xl shadow-2xl z-40 overflow-hidden"
            initial={{ y: "100%", opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 30 }}
          >
            {cafes.filter(cafe => cafe.id === activeCafe).map(cafe => (
              <div key={cafe.id} className="relative">
                <div className="relative h-48 w-full">
                  <img 
                    src={cafe.image} 
                    alt={cafe.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  <button 
                    onClick={() => setActiveCafe(null)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md"
                  >
                    <ArrowLeft size={20} className="text-[#6F4E37] transform rotate-45" />
                  </button>
                  
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="font-bold text-2xl text-white">{cafe.name}</h3>
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
                      >
                        <Heart size={18} className="text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-[#6F4E37]">
                      <Clock size={18} />
                      <span className="font-medium">{cafe.openTime}</span>
                      <span className="text-xs py-0.5 px-2 bg-green-50 text-green-600 rounded-full font-medium">Abierto ahora</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-[#6F4E37]">
                      <MapPin size={18} />
                      <span className="font-medium">{cafe.distance} de distancia</span>
                    </div>
                    <motion.button 
                      className="text-[#6F4E37] bg-[#FAF3E0] p-2 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Navigation size={18} />
                    </motion.button>
                  </div>
                  
                  <div className="py-3">
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
                      <span className="text-sm font-medium bg-gray-50 text-[#6F4E37] px-3 py-1 rounded-full">
                        Terraza
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 py-4">
                    <motion.button 
                      className="flex-1 bg-[#6F4E37] text-white py-3 rounded-xl font-medium hover:bg-[#5d4230] transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Coffee size={18} />
                      <span>Ver menú</span>
                    </motion.button>
                    <motion.button 
                      className="w-12 h-12 flex items-center justify-center border border-[#6F4E37] text-[#6F4E37] rounded-xl hover:bg-[#6F4E37] hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pulsating indicator on map when a cafe is selected */}
      {activeCafe && (
        <motion.div 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          variants={pulseVariants}
          animate="pulse"
        >
          <div className="w-16 h-16 bg-[#6F4E37]/30 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-[#6F4E37]/60 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[#6F4E37] rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};