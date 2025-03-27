import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { MapFocusProps } from '@/common/types/map/mapTypes';

/**
 * Componente para centrar el mapa en la cafetería seleccionada o ubicación del usuario
 */
const MapFocus: React.FC<MapFocusProps> = ({ cafeId, positions, userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (cafeId) {
      const position = positions.find(pos => pos.id === cafeId);
      if (position) {
        map.flyTo([position.lat, position.lng], 15, {
          duration: 2
        });
      }
    } else if (userLocation) {
      map.flyTo(userLocation, 15, {
        duration: 2
      });
    }
  }, [cafeId, map, positions, userLocation]);
  
  return null;
};

export default MapFocus;