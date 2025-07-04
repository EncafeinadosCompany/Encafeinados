import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/common/ui/icons';

interface MapControlsProps {
  mapInstance: L.Map | null;
  getUserLocation: () => void;
  locatingUser: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  mapInstance,
  getUserLocation,
  locatingUser
}) => {
  return (
    <>
      <div className="absolute top-24 right-4 z-[400] flex flex-col gap-3 pointer-events-auto">
        <motion.button
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => mapInstance?.zoomIn()}
        >
          <span className="text-xl font-bold text-[#6F4E37]">+</span>
        </motion.button>
        <motion.button
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => mapInstance?.zoomOut()}
        >
          <span className="text-xl font-bold text-[#6F4E37]">−</span>
        </motion.button>
      </div>

      <motion.button
        className="absolute bottom-36 right-4 z-[999] bg-white rounded-full p-3 shadow-lg pointer-events-auto"
        style={{
          position: "fixed",
          zIndex: 9999,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={getUserLocation}
        disabled={locatingUser}
      >
        <Navigation
          size={20}
          className={`${locatingUser ? "animate-pulse" : ""} text-[#6F4E37]`}
        />
      </motion.button>
    </>
  );
};

export default MapControls;