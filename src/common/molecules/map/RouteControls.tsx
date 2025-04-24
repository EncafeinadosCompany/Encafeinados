import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Route as RouteIcon, Navigation } from 'lucide-react';

interface RouteControlsProps {
  isActive: boolean;
  transportMode: 'walking' | 'cycling' | 'driving';
  setTransportMode: (mode: 'walking' | 'cycling' | 'driving') => void;
  distance: number | null;
  duration: number | null;
  isCalculating: boolean;
  onClose: () => void;
  cafeName?: string;
  origin?: [number, number] | null;
  destination?: [number, number] | null;
  routeInfo?: any | null;
}

const RouteControls: React.FC<RouteControlsProps> = ({
  isActive,
  transportMode,
  setTransportMode,
  distance,
  duration,
  isCalculating,
  onClose,
  cafeName,
  // Nuevas props
  origin,
  destination,
  routeInfo
}) => {
  if (!isActive) return null;
  
  const startNavigation = () => {
    if (!origin || !destination) {
      return;
    }

    const googleMapsModes = {
      walking: 'walking',
      cycling: 'bicycling',
      driving: 'driving'
    };
    
    const originCoords = `${origin[0]},${origin[1]}`;
    const destinationCoords = `${destination[0]},${destination[1]}`;
    
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoords}&destination=${destinationCoords}&travelmode=${googleMapsModes[transportMode]}&dir_action=navigate`;
    
    window.open(googleMapsUrl, '_blank');
  };

  const transportIcons = {
    walking: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 4v6m-2 0l-4 6h6l-1 4" />
        <circle cx="12" cy="4" r="2" />
      </svg>
    ),
    cycling: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="6" cy="15" r="3" />
        <circle cx="18" cy="15" r="3" />
        <path d="M6 15 9 6l3 5.5L9 15h9" />
      </svg>
    ),
    driving: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17h10M6 11l3-6h6l3 6M5 11h14v3H5zM6 17v2M18 17v2" />
      </svg>
    ),
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-[900] p-4 pb-8 md:pb-4"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <RouteIcon size={20} className="text-[#6F4E37] mr-2" />
          <h3 className="font-semibold text-[#6F4E37]">
            {cafeName ? `Ruta a ${cafeName}` : 'Tu Ruta'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center">
          <RouteIcon size={18} className="text-[#6F4E37] mr-2" />
          <span className="font-medium">
            {isCalculating ? (
              <span className="animate-pulse">Calculando...</span>
            ) : distance ? (
              `${distance} km`
            ) : (
              '-- km'
            )}
          </span>
        </div>
        <div className="flex items-center">
          <Clock size={18} className="text-[#6F4E37] mr-2" />
          <span className="font-medium">
            {isCalculating ? (
              <span className="animate-pulse">Calculando...</span>
            ) : duration ? (
              `${duration} min`
            ) : (
              '-- min'
            )}
          </span>
        </div>
      </div>

      {isCalculating ? (
        <div className="w-full p-3 bg-amber-50 rounded-lg text-center">
          <span className="text-amber-700 flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Calculando la mejor ruta...
          </span>
        </div>
      ) : routeInfo === null ? (
        <div className="w-full p-3 bg-red-50 rounded-lg text-center">
          <span className="text-red-700">
            No se pudo calcular la ruta. Por favor intenta otro modo de transporte.
          </span>
        </div>
      ) : null}

      <div className="flex justify-around border-t pt-4">
        {(['walking', 'cycling', 'driving'] as const).map((mode) => (
          <button
            key={mode}
            className={`flex flex-col items-center p-2 rounded-lg transition ${
              transportMode === mode
                ? 'bg-[#6F4E37]/10 text-[#6F4E37]'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setTransportMode(mode)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                transportMode === mode
                  ? 'bg-[#6F4E37] text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {transportIcons[mode]}
            </div>
            <span className="text-xs capitalize">
              {mode === 'walking' 
                ? 'A pie' 
                : mode === 'cycling' 
                ? 'Bicicleta' 
                : 'Conduciendo'}
            </span>
          </button>
        ))}
      </div>

      <button
        className="w-full mt-4 bg-[#6F4E37] hover:bg-[#5d4230] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        onClick={startNavigation}
        disabled={!origin || !destination || isCalculating}
      >
        <Navigation size={18} />
        Navegar con Google Maps
      </button>
    </motion.div>
  );
};

export default RouteControls;