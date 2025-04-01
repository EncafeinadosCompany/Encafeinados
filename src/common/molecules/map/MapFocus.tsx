import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { MapFocusProps } from '@/common/types/map/mapTypes';

/**
  Component to center the map on the selected coffee shop or user location
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