import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { MapFocusProps } from '@/api/types/map/map_search.types';

/**
  Component to center the map on the selected coffee shop
 */
const MapFocus: React.FC<MapFocusProps> = ({ cafeId, positions, userLocation }) => {
  const map = useMap();
  const prevCafeIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Solo hacer flyTo cuando se selecciona un nuevo café, no cuando se deselecciona
    if (cafeId && cafeId !== prevCafeIdRef.current) {
      const position = positions.find(pos => pos.id === cafeId);
      if (position) {
        map.flyTo([position.lat, position.lng], 16, {
          duration: 1.5
        });
      }
      prevCafeIdRef.current = cafeId;
    } 
    // Importante: No volver a la ubicación del usuario automáticamente
    // cuando cafeId cambia a null
  }, [cafeId, map, positions]);
  
  return null;
};

export default MapFocus;