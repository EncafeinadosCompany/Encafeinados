import React, { useMemo } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
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
          <div class="user-marker-shadow"></div>
          <div class="user-marker-outer">
            <div class="user-marker-middle">
              <div class="user-marker-inner">
                <div class="user-marker-core"></div>
              </div>
            </div>
          </div>
          ${pulsing ? '<div class="user-marker-pulse"></div>' : ''}
          <div class="user-marker-accuracy"></div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });
  }, [pulsing]);
  
  if (!position) return null;
  
  return (
    <Marker
      position={position}
      icon={userIcon}
      zIndexOffset={2000}
    >
      <Tooltip direction="top" permanent={false} className="user-location-tooltip">
        Tu ubicación
      </Tooltip>
    </Marker>
  );
};

export default UserMarker;