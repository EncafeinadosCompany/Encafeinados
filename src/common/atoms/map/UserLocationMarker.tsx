import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { UserLocationMarkerProps } from '@/common/types/map/mapTypes';

/**
 * Componente para mostrar la ubicación del usuario en el mapa
 */
const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ position, pulsing = false }) => {
  if (!position) return null;
  
  return (
    <Marker 
      position={position}
      icon={L.divIcon({
        className: 'user-location-marker',
        html: `<div class="user-marker ${pulsing ? 'pulsing' : ''}">
                <div class="user-marker-inner"></div>
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })}
    />
  );
};

export default UserLocationMarker;