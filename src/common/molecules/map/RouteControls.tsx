import React from 'react';
import { motion } from 'framer-motion';
import { TransportMode } from '@/common/hooks/map/useRouteNavigation';
import { Navigation, Clock, ArrowLeft, X } from 'lucide-react';

interface RouteControlsProps {
  isActive: boolean;
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
  distance: number | null;
  duration: number | null; // Nota: usamos 'duration' aquí para mantener consistencia
  isCalculating: boolean;
  onClose: () => void;
  cafeName: string;
}

const RouteControls: React.FC<RouteControlsProps> = ({
  isActive,
  transportMode,
  setTransportMode,
  distance,
  duration,
  isCalculating,
  onClose,
  cafeName
}) => {
  if (!isActive) return null;
  
  // Formatear distancia para mostrarla al usuario
  const formatDistance = (meters: number | null): string => {
    if (!meters && meters !== 0) return "Calculando...";
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };
  
  // Formatear tiempo en segundos a un formato legible
  const formatDuration = (seconds: number | null): string => {
    if (!seconds && seconds !== 0) return "Calculando...";
    
    const minutes = Math.round((seconds || 0) / 60);
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const displayHours = Math.floor(minutes / 60);
    const displayMinutes = minutes % 60;
    
    if (displayMinutes === 0) {
      return `${displayHours} h`;
    }
    
    return `${displayHours} h ${displayMinutes} min`;
  };
  
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl z-50 p-4"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30 }}
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-[#6F4E37]" />
        </button>
        <h3 className="font-bold text-lg text-[#2C1810]">
          Ruta hacia {cafeName}
        </h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-[#6F4E37]" />
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <Navigation size={18} className="text-[#6F4E37]" />
          <span className="font-medium">
            {isCalculating ? 'Calculando...' : formatDistance(distance)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={18} className="text-[#6F4E37]" />
          <span className="font-medium">
            {isCalculating ? 'Calculando...' : formatDuration(duration)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between gap-2">
        <TransportButton
          mode="walking"
          current={transportMode}
          onChange={setTransportMode}
          label="A pie"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 14.5L9.5 18.5L6 16.5L7 14.5M13 14.5L17 9.5M13 14.5L15 18.5M7 14.5L9.5 9M7 14.5L3 15M9.5 9L12 5.5L16.5 8.5M9.5 9L6 9M17 9.5L20 11M17 9.5L15 18.5M15 18.5L18.5 17" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <TransportButton
          mode="bicycling"
          current={transportMode}
          onChange={setTransportMode}
          label="Bicicleta"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m12 19-3-6 4-3 1 3h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <TransportButton
          mode="driving"
          current={transportMode}
          onChange={setTransportMode}
          label="Auto"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 17h2V7H3v10h2M18.5 17l-1.59-5.96a1 1 0 0 0-.97-.74h-8.5a1 1 0 0 0-.96.74L5 17M12 17v2M6.75 17H17.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
      </div>
      
      <button className="mt-4 w-full bg-[#6F4E37] text-white p-3 rounded-lg font-medium">
        Iniciar navegación
      </button>
    </motion.div>
  );
};

interface TransportButtonProps {
  mode: TransportMode;
  current: TransportMode;
  onChange: (mode: TransportMode) => void;
  label: string;
  icon: React.ReactNode;
}

const TransportButton: React.FC<TransportButtonProps> = ({ mode, current, onChange, label, icon }) => {
  const isActive = mode === current;
  
  return (
    <button
      className={`flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-lg border ${
        isActive 
          ? 'border-[#6F4E37] bg-[#FAF3E0] text-[#6F4E37]' 
          : 'border-gray-200 text-gray-600'
      }`}
      onClick={() => onChange(mode)}
    >
      <div className={`${isActive ? 'text-[#6F4E37]' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default RouteControls;