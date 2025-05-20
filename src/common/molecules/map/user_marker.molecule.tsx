import React, { useMemo } from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import L from 'leaflet';
import coffeeCupMarkerImg from '@/assets/images/User_Map_Marker.png';

interface UserMarkerProps {
  position: LatLngTuple | null;
  pulsing?: boolean; 
}

const UserMarker: React.FC<UserMarkerProps> = ({ position, pulsing = true }) => {
  // Obtener referencia al mapa para ajustar el tamaño según el zoom
  const map = useMap();
  
  const userIcon = useMemo(() => {
    // Obtener el zoom actual
    const zoom = map.getZoom();
    
    // Ajustar el tamaño según el zoom, similar a café markers
    let size = 36; // Tamaño base
    if (zoom < 13) size = 32;
    if (zoom < 15 && zoom >= 13) size = 36;
    if (zoom >= 15) size = 40;
    
    return L.divIcon({
      className: 'coffee-user-marker',
      html: `
        <div class="coffee-marker-container">
          <img 
            src="${coffeeCupMarkerImg}" 
            class="coffee-marker-img" 
            alt="Tu ubicación"
            style="width: 100%; height: auto;" 
          />
          ${pulsing ? `
            <div class="coffee-steam" style="position: absolute; top: -5px; left: 50%; transform: translateX(-50%); width: 24px; height: 20px;">
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                <path d="M4 16C2 13 3 10 5 8" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-1"/>
                <path d="M12 18C9 14 10 10 12 7" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-2"/>
                <path d="M20 16C22 13 21 10 19 8" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-3"/>
              </svg>
            </div>
          ` : ''}
        </div>
      `,
      iconSize: [size, size * 1.28], // Proporción aproximada del pin original
      iconAnchor: [size / 2, size * 1.28], // Punto inferior del pin
      tooltipAnchor: [0, -size / 1.2], // Ajuste para el tooltip
    });
  }, [pulsing, map.getZoom()]);
  
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

