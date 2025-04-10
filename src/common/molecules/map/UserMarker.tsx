import React, { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import L from 'leaflet';

interface UserMarkerProps {
  position: LatLngTuple | null;
  pulsing?: boolean;
}

const UserMarker: React.FC<UserMarkerProps> = ({ position, pulsing = true }) => {
  const userIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="user-marker ${pulsing ? 'pulsing' : ''}">
          <div class="user-marker-outer">
            <div class="user-marker-middle">
              <div class="user-marker-inner"></div>
            </div>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }, [pulsing]);
  
  if (!position) return null;
  
  return (
    <Marker
      position={position}
      icon={userIcon}
      zIndexOffset={2000} // Asegura que esté por encima de todos los marcadores
    />
  );
};

export default UserMarker;